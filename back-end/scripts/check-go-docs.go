package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
)

// main はGo source全体の関数、method、typeにGoDocがあることを検証する。
func main() {
	root := "."
	if len(os.Args) > 1 {
		root = os.Args[1]
	}

	failures, err := collectMissingDocs(root)
	if err != nil {
		fmt.Fprintf(os.Stderr, "check go docs: %v\n", err)
		os.Exit(1)
	}

	if len(failures) > 0 {
		fmt.Fprintln(os.Stderr, "GoDoc check failed:")
		for _, failure := range failures {
			fmt.Fprintf(os.Stderr, "- %s\n", failure)
		}
		os.Exit(1)
	}

	fmt.Println("GoDoc check passed.")
}

// collectMissingDocs は指定root配下のGo宣言を走査し、GoDoc不足の一覧を返す。
func collectMissingDocs(root string) ([]string, error) {
	failures := []string{}
	fileSet := token.NewFileSet()

	err := filepath.WalkDir(root, func(path string, dirEntry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}

		if shouldSkip(dirEntry) {
			return filepath.SkipDir
		}

		if dirEntry.IsDir() || !strings.HasSuffix(path, ".go") {
			return nil
		}

		file, err := parser.ParseFile(fileSet, path, nil, parser.ParseComments)
		if err != nil {
			return fmt.Errorf("parse %s: %w", path, err)
		}

		failures = append(failures, inspectFile(fileSet, path, file)...)

		return nil
	})
	if err != nil {
		return nil, err
	}

	return failures, nil
}

// shouldSkip はGoDoc検証から除外するdirectoryかどうかを判定する。
func shouldSkip(dirEntry os.DirEntry) bool {
	return dirEntry.IsDir() && (dirEntry.Name() == ".cache" || dirEntry.Name() == "vendor")
}

// inspectFile は1つのGo file内の関数、method、type宣言のGoDoc不足を返す。
func inspectFile(fileSet *token.FileSet, path string, file *ast.File) []string {
	failures := []string{}

	for _, declaration := range file.Decls {
		switch typedDeclaration := declaration.(type) {
		case *ast.FuncDecl:
			failures = appendMissingFuncDoc(fileSet, path, typedDeclaration, failures)
		case *ast.GenDecl:
			failures = appendMissingTypeDocs(fileSet, path, typedDeclaration, failures)
		}
	}

	return failures
}

// appendMissingFuncDoc は関数またはmethodのGoDoc不足をfailuresへ追加する。
func appendMissingFuncDoc(
	fileSet *token.FileSet,
	path string,
	declaration *ast.FuncDecl,
	failures []string,
) []string {
	if hasNamedDoc(declaration.Doc, declaration.Name.Name) {
		return failures
	}

	position := fileSet.Position(declaration.Pos())
	return append(failures, fmt.Sprintf("%s:%d func %s is missing GoDoc", path, position.Line, declaration.Name.Name))
}

// appendMissingTypeDocs はtype宣言のGoDoc不足をfailuresへ追加する。
func appendMissingTypeDocs(
	fileSet *token.FileSet,
	path string,
	declaration *ast.GenDecl,
	failures []string,
) []string {
	for _, spec := range declaration.Specs {
		typeSpec, ok := spec.(*ast.TypeSpec)
		if !ok {
			continue
		}

		if hasNamedDoc(declaration.Doc, typeSpec.Name.Name) {
			continue
		}

		position := fileSet.Position(typeSpec.Pos())
		failures = append(failures, fmt.Sprintf("%s:%d type %s is missing GoDoc", path, position.Line, typeSpec.Name.Name))
	}

	return failures
}

// hasNamedDoc はGoDocが存在し、対象識別子名から始まっているかを判定する。
func hasNamedDoc(commentGroup *ast.CommentGroup, name string) bool {
	if commentGroup == nil {
		return false
	}

	comment := strings.TrimSpace(commentGroup.Text())
	return strings.HasPrefix(comment, name+" ") || strings.HasPrefix(comment, name+"は")
}
