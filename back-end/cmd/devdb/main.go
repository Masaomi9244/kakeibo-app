package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const defaultDatabaseURL = "postgres://postgres:postgres@localhost:5432/kakeibo?sslmode=disable"

// commandConfig はローカルDB操作commandに必要な設定を表す。
type commandConfig struct {
	DatabaseURL   string
	MigrationsDir string
	SeedFile      string
}

// sqlExecer はsql.DBとsql.TxのSQL実行に必要なmethodだけを表す。
type sqlExecer interface {
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
}

// migrationFile は1つのmigration fileと適用管理用versionを表す。
type migrationFile struct {
	Name    string
	Path    string
	Version string
}

// main はローカルDB操作commandのentrypointを提供する。
func main() {
	if err := run(os.Args[1:], os.Stdout, os.Stderr); err != nil {
		log.Fatal(err)
	}
}

// run は指定されたsubcommandに応じてmigration、seed、resetを実行する。
func run(args []string, stdout, stderr io.Writer) error {
	command, err := validateCommandArgs(args, stderr)
	if err != nil {
		return err
	}

	cfg := loadCommandConfig()
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	db, err := openDatabase(ctx, cfg)
	if err != nil {
		return err
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("close database: %v", err)
		}
	}()

	return executeCommand(ctx, db, cfg, stdout, stderr, command)
}

// validateCommandArgs はsubcommand指定が1つだけ存在するか検証する。
func validateCommandArgs(args []string, stderr io.Writer) (string, error) {
	if len(args) != 1 {
		if err := printUsage(stderr); err != nil {
			return "", err
		}

		return "", errors.New("command is required")
	}

	return args[0], nil
}

// executeCommand は検証済みsubcommandに対応するDB操作を実行する。
func executeCommand(
	ctx context.Context,
	db *sql.DB,
	cfg commandConfig,
	stdout io.Writer,
	stderr io.Writer,
	command string,
) error {
	switch command {
	case "migrate":
		return migrate(ctx, db, cfg, stdout)
	case "seed":
		return seed(ctx, db, cfg, stdout)
	case "reset":
		if err := reset(ctx, db, stdout); err != nil {
			return err
		}
		if err := migrate(ctx, db, cfg, stdout); err != nil {
			return err
		}
		return seed(ctx, db, cfg, stdout)
	default:
		if err := printUsage(stderr); err != nil {
			return err
		}
		return fmt.Errorf("unknown command: %s", command)
	}
}

// printUsage は利用できるsubcommandを出力する。
func printUsage(writer io.Writer) error {
	if err := writeOutput(writer, "usage: go run ./cmd/devdb [migrate|seed|reset]"); err != nil {
		return err
	}

	return nil
}

// loadCommandConfig は環境変数からローカルDB操作commandの設定を読み込む。
func loadCommandConfig() commandConfig {
	return commandConfig{
		DatabaseURL:   getEnv("DATABASE_URL", defaultDatabaseURL),
		MigrationsDir: getEnv("DB_MIGRATIONS_DIR", "migrations"),
		SeedFile:      getEnv("DB_SEED_FILE", "seeds/local.sql"),
	}
}

// getEnv は環境変数が未設定の場合にfallbackを返す。
func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

// openDatabase はPostgreSQLへ接続し、疎通確認済みのDB handleを返す。
func openDatabase(ctx context.Context, cfg commandConfig) (*sql.DB, error) {
	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	if err := db.PingContext(ctx); err != nil {
		if closeErr := db.Close(); closeErr != nil {
			return nil, fmt.Errorf("ping database: %w; close database: %w", err, closeErr)
		}

		return nil, fmt.Errorf("ping database: %w", err)
	}

	return db, nil
}

// reset はpublic schemaを作り直し、ローカルDBを空の状態へ戻す。
func reset(ctx context.Context, db *sql.DB, stdout io.Writer) error {
	if _, err := db.ExecContext(ctx, "DROP SCHEMA IF EXISTS public CASCADE"); err != nil {
		return fmt.Errorf("drop public schema: %w", err)
	}

	if _, err := db.ExecContext(ctx, "CREATE SCHEMA public"); err != nil {
		return fmt.Errorf("create public schema: %w", err)
	}

	if err := writeOutput(stdout, "reset public schema"); err != nil {
		return err
	}

	return nil
}

// migrate は未適用migrationをtimestamp順に適用する。
func migrate(ctx context.Context, db *sql.DB, cfg commandConfig, stdout io.Writer) error {
	if err := ensureSchemaMigrations(ctx, db); err != nil {
		return err
	}

	migrations, err := listMigrationFiles(cfg.MigrationsDir)
	if err != nil {
		return err
	}

	for _, migration := range migrations {
		if err := applyMigrationIfNeeded(ctx, db, migration, stdout); err != nil {
			return err
		}
	}

	return nil
}

// applyMigrationIfNeeded は未適用migrationだけを適用し、結果を出力する。
func applyMigrationIfNeeded(
	ctx context.Context,
	db *sql.DB,
	migration migrationFile,
	stdout io.Writer,
) error {
	applied, err := isMigrationApplied(ctx, db, migration.Version)
	if err != nil {
		return err
	}

	if applied {
		return writeOutput(stdout, "skip %s", migration.Name)
	}

	if err := applyMigration(ctx, db, migration); err != nil {
		return err
	}

	return writeOutput(stdout, "applied %s", migration.Name)
}

// ensureSchemaMigrations はmigration適用履歴tableを用意する。
func ensureSchemaMigrations(ctx context.Context, db *sql.DB) error {
	const query = `
CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    name text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
)`

	if _, err := db.ExecContext(ctx, query); err != nil {
		return fmt.Errorf("ensure schema_migrations: %w", err)
	}

	return nil
}

// listMigrationFiles はmigration fileをtimestamp順に列挙する。
func listMigrationFiles(migrationsDir string) ([]migrationFile, error) {
	paths, err := filepath.Glob(filepath.Join(migrationsDir, "*.sql"))
	if err != nil {
		return nil, fmt.Errorf("list migration files: %w", err)
	}

	sort.Strings(paths)

	migrations := make([]migrationFile, 0, len(paths))
	for _, path := range paths {
		name := filepath.Base(path)
		if len(name) < 14 {
			return nil, fmt.Errorf("invalid migration filename: %s", name)
		}

		migrations = append(migrations, migrationFile{
			Name:    name,
			Path:    path,
			Version: name[:14],
		})
	}

	return migrations, nil
}

// isMigrationApplied は指定versionのmigrationが適用済みか判定する。
func isMigrationApplied(ctx context.Context, db *sql.DB, version string) (bool, error) {
	var exists bool
	if err := db.QueryRowContext(
		ctx,
		"SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)",
		version,
	).Scan(&exists); err != nil {
		return false, fmt.Errorf("check migration %s: %w", version, err)
	}

	return exists, nil
}

// applyMigration は1つのmigration fileをtransaction内で適用する。
func applyMigration(ctx context.Context, db *sql.DB, migration migrationFile) error {
	content, err := os.ReadFile(migration.Path)
	if err != nil {
		return fmt.Errorf("read migration %s: %w", migration.Name, err)
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin migration %s: %w", migration.Name, err)
	}

	if err := execSQLScript(ctx, tx, string(content)); err != nil {
		return rollbackWithError(tx, fmt.Errorf("execute migration %s: %w", migration.Name, err))
	}

	if _, err := tx.ExecContext(
		ctx,
		"INSERT INTO schema_migrations (version, name) VALUES ($1, $2)",
		migration.Version,
		migration.Name,
	); err != nil {
		return rollbackWithError(tx, fmt.Errorf("record migration %s: %w", migration.Name, err))
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit migration %s: %w", migration.Name, err)
	}

	return nil
}

// rollbackWithError はtransactionをrollbackし、元のerrorを返す。
func rollbackWithError(tx *sql.Tx, originalErr error) error {
	if err := tx.Rollback(); err != nil {
		return fmt.Errorf("%w; rollback: %w", originalErr, err)
	}

	return originalErr
}

// seed はローカル開発用seed SQLを適用する。
func seed(ctx context.Context, db *sql.DB, cfg commandConfig, stdout io.Writer) error {
	content, err := os.ReadFile(cfg.SeedFile)
	if err != nil {
		return fmt.Errorf("read seed file: %w", err)
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin seed: %w", err)
	}

	if err := execSQLScript(ctx, tx, string(content)); err != nil {
		return rollbackWithError(tx, fmt.Errorf("execute seed: %w", err))
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit seed: %w", err)
	}

	if err := writeOutput(stdout, "seeded %s", cfg.SeedFile); err != nil {
		return err
	}

	return nil
}

// writeOutput はcommandの実行結果を標準出力または標準errorへ書き込む。
func writeOutput(writer io.Writer, format string, args ...any) error {
	if _, err := fmt.Fprintf(writer, format+"\n", args...); err != nil {
		return fmt.Errorf("write output: %w", err)
	}

	return nil
}

// execSQLScript はSQL scriptをstatement単位で実行する。
func execSQLScript(ctx context.Context, execer sqlExecer, script string) error {
	for _, statement := range splitSQLStatements(script) {
		trimmedStatement := strings.TrimSpace(statement)
		if trimmedStatement == "" {
			continue
		}

		if _, err := execer.ExecContext(ctx, trimmedStatement); err != nil {
			return fmt.Errorf("execute statement: %w", err)
		}
	}

	return nil
}

// splitSQLStatements は単一引用符内のsemicolonを保持したままSQL文を分割する。
func splitSQLStatements(script string) []string {
	statements := make([]string, 0)
	var builder strings.Builder
	inSingleQuote := false
	runes := []rune(script)

	for index := 0; index < len(runes); index++ {
		current := runes[index]
		builder.WriteRune(current)

		if current == '\'' {
			if inSingleQuote && index+1 < len(runes) && runes[index+1] == '\'' {
				index++
				builder.WriteRune(runes[index])
				continue
			}

			inSingleQuote = !inSingleQuote
			continue
		}

		if current == ';' && !inSingleQuote {
			statements = append(statements, builder.String())
			builder.Reset()
		}
	}

	if strings.TrimSpace(builder.String()) != "" {
		statements = append(statements, builder.String())
	}

	return statements
}
