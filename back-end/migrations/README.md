# Migrations

DBマイグレーションを配置するディレクトリです。

初期schemaはこのディレクトリのSQLファイルで管理します。

## ファイル名

```txt
YYYYMMDDHHMMSS_snake_case.sql
```

例：

```txt
20260504090000_create_users.sql
```

## 検証

```bash
make db-lint
make db-format
```

SQL migrationが存在する場合、`sqlfluff` を必須にします。
PostgreSQL dialectとしてlint / formatし、ファイル名も機械的に検証します。
同じtimestampのmigrationを複数作ることは禁止します。
