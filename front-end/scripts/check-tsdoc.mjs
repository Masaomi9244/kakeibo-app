import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

/** 検査対象にするsrcディレクトリの絶対path。 */
const sourceRoot = path.join(process.cwd(), "src");
/** 関数コメントに必須のTSDocタグ一覧。 */
const requiredFunctionTags = new Set(["description", "example", "param", "returns"]);
/** 検査対象にする拡張子一覧。 */
const targetExtensions = new Set([".ts", ".tsx"]);
/** 自動生成などで検査対象から外すファイル名一覧。 */
const ignoredFiles = new Set(["next-env.d.ts"]);

/** 検査対象ファイルの絶対path一覧。 */
const sourceFiles = [];

/**
 * @description 検査対象のTypeScriptファイルを再帰的に収集する。
 * @param dirPath - 探索するdirectory path。
 * @returns なし。
 * @example
 * collectSourceFiles(sourceRoot);
 */
const collectSourceFiles = (dirPath) => {
  for (const entry of readdirSync(dirPath)) {
    /** 探索中entryの絶対path。 */
    const entryPath = path.join(dirPath, entry);
    /** 探索中entryのファイル種別情報。 */
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      collectSourceFiles(entryPath);
      continue;
    }

    if (
      targetExtensions.has(path.extname(entryPath)) &&
      !ignoredFiles.has(path.basename(entryPath))
    ) {
      sourceFiles.push(entryPath);
    }
  }
};

/**
 * @description TypeScript AST nodeに紐づくJSDoc nodeを取得する。
 * @param node - 検査対象のAST node。
 * @returns AST nodeに紐づくJSDoc node一覧。
 * @example
 * getJsDocNodes(node);
 */
const getJsDocNodes = (node) => node.jsDoc ?? [];

/**
 * @description AST node直前のTSDoc形式コメント有無を判定する。
 * @param node - 検査対象のAST node。
 * @param sourceFile - nodeを含むsource file。
 * @returns TSDoc形式コメントがある場合はtrue。
 * @example
 * hasLeadingTsDoc(node, sourceFile);
 */
const hasLeadingTsDoc = (node, sourceFile) => {
  /** source file全体の文字列。 */
  const sourceText = sourceFile.getFullText();
  /** node直前のコメント範囲一覧。 */
  const commentRanges =
    ts.getLeadingCommentRanges(sourceText, node.getFullStart()) ?? [];

  return commentRanges.some((range) =>
    sourceText.slice(range.pos, range.end).startsWith("/**"),
  );
};

/**
 * @description AST nodeにTSDoc形式コメントがあるか判定する。
 * @param node - 検査対象のAST node。
 * @param sourceFile - nodeを含むsource file。
 * @returns TSDoc形式コメントがある場合はtrue。
 * @example
 * hasJsDoc(node, sourceFile);
 */
const hasJsDoc = (node, sourceFile) =>
  getJsDocNodes(node).length > 0 || hasLeadingTsDoc(node, sourceFile);

/**
 * @description AST nodeに付いたTSDocタグ名を取得する。
 * @param node - 検査対象のAST node。
 * @returns TSDocタグ名一覧。
 * @example
 * getTagNames(node);
 */
const getTagNames = (node) =>
  new Set(
    getJsDocNodes(node).flatMap((comment) =>
      (comment.tags ?? []).map((tag) => tag.tagName.escapedText),
    ),
  );

/**
 * @description 検査失敗時に表示するsource位置を作成する。
 * @param filePath - 検査対象ファイルpath。
 * @param sourceFile - 検査対象source file。
 * @param node - 検査対象AST node。
 * @returns source位置を表す文字列。
 * @example
 * formatLocation(filePath, sourceFile, node);
 */
const formatLocation = (filePath, sourceFile, node) => {
  /** nodeの開始行番号。 */
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));

  return `${path.relative(process.cwd(), filePath)}:${line + 1}`;
};

/**
 * @description 関数TSDocの必須タグ有無を検査する。
 * @param filePath - 検査対象ファイルpath。
 * @param sourceFile - 検査対象source file。
 * @param node - 検査対象AST node。
 * @param label - エラー表示用の対象名。
 * @param failures - 検査失敗一覧。
 * @returns なし。
 * @example
 * checkFunctionDoc(filePath, sourceFile, node, "function getValue", failures);
 */
const checkFunctionDoc = (filePath, sourceFile, node, label, failures) => {
  /** 対象nodeに紐づくTSDoc一覧。 */
  const docs = getJsDocNodes(node);
  /** 対象nodeに紐づくTSDocタグ名一覧。 */
  const tags = getTagNames(node);
  /** 対象nodeで不足している必須タグ名一覧。 */
  const missingTags = [...requiredFunctionTags].filter((tagName) => !tags.has(tagName));

  if (docs.length === 0 || missingTags.length > 0) {
    failures.push(
      `${formatLocation(filePath, sourceFile, node)} ${label} is missing TSDoc tags: ${missingTags.join(", ") || "all"}`,
    );
  }
};

/**
 * @description typeまたはinterfaceのTSDoc有無を検査する。
 * @param filePath - 検査対象ファイルpath。
 * @param sourceFile - 検査対象source file。
 * @param node - 検査対象AST node。
 * @param label - エラー表示用の対象名。
 * @param failures - 検査失敗一覧。
 * @returns なし。
 * @example
 * checkTypeDoc(filePath, sourceFile, node, "type Props", failures);
 */
const checkTypeDoc = (filePath, sourceFile, node, label, failures) => {
  if (!hasJsDoc(node, sourceFile)) {
    failures.push(
      `${formatLocation(filePath, sourceFile, node)} ${label} is missing TSDoc`,
    );
  }
};

/**
 * @description const定義のTSDoc有無を検査する。
 * @param filePath - 検査対象ファイルpath。
 * @param sourceFile - 検査対象source file。
 * @param node - 検査対象AST node。
 * @param failures - 検査失敗一覧。
 * @returns なし。
 * @example
 * checkConstDoc(filePath, sourceFile, node, failures);
 */
const checkConstDoc = (filePath, sourceFile, node, failures) => {
  /** 対象variable statementがconstかどうか。 */
  const isConst = (node.declarationList.flags & ts.NodeFlags.Const) !== 0;

  if (isConst && !hasJsDoc(node, sourceFile)) {
    failures.push(
      `${formatLocation(filePath, sourceFile, node)} const is missing TSDoc`,
    );
  }
};

/**
 * @description object型propertyのTSDoc有無を検査する。
 * @param filePath - 検査対象ファイルpath。
 * @param sourceFile - 検査対象source file。
 * @param node - 検査対象AST node。
 * @param failures - 検査失敗一覧。
 * @returns なし。
 * @example
 * checkObjectMemberDoc(filePath, sourceFile, node, failures);
 */
const checkObjectMemberDoc = (filePath, sourceFile, node, failures) => {
  if (!hasJsDoc(node, sourceFile)) {
    failures.push(
      `${formatLocation(filePath, sourceFile, node)} object member is missing TSDoc`,
    );
  }
};

/**
 * @description 変数宣言が関数を格納している場合に関数名を取得する。
 * @param declaration - 検査対象の変数宣言。
 * @returns 関数名。関数でない場合はnull。
 * @example
 * getVariableFunctionName(declaration);
 */
const getVariableFunctionName = (declaration) => {
  if (
    ts.isIdentifier(declaration.name) &&
    declaration.initializer !== undefined &&
    (ts.isArrowFunction(declaration.initializer) ||
      ts.isFunctionExpression(declaration.initializer))
  ) {
    return declaration.name.text;
  }

  return null;
};

/**
 * @description AST nodeを再帰的に検査する。
 * @param filePath - 検査対象ファイルpath。
 * @param sourceFile - 検査対象source file。
 * @param node - 検査対象AST node。
 * @param failures - 検査失敗一覧。
 * @returns なし。
 * @example
 * visit(filePath, sourceFile, sourceFile, failures);
 */
const visit = (filePath, sourceFile, node, failures) => {
  if (ts.isFunctionDeclaration(node) && node.name !== undefined) {
    checkFunctionDoc(
      filePath,
      sourceFile,
      node,
      `function ${node.name.text}`,
      failures,
    );
  }

  if (ts.isVariableStatement(node)) {
    checkConstDoc(filePath, sourceFile, node, failures);

    for (const declaration of node.declarationList.declarations) {
      /** constに格納された関数名。 */
      const functionName = getVariableFunctionName(declaration);
      if (functionName !== null) {
        checkFunctionDoc(
          filePath,
          sourceFile,
          node,
          `function ${functionName}`,
          failures,
        );
      }
    }
  }

  if (ts.isTypeAliasDeclaration(node)) {
    checkTypeDoc(filePath, sourceFile, node, `type ${node.name.text}`, failures);
  }

  if (ts.isInterfaceDeclaration(node)) {
    checkTypeDoc(filePath, sourceFile, node, `interface ${node.name.text}`, failures);
  }

  if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
    checkObjectMemberDoc(filePath, sourceFile, node, failures);
  }

  ts.forEachChild(node, (child) => visit(filePath, sourceFile, child, failures));
};

collectSourceFiles(sourceRoot);

/** 検査失敗メッセージ一覧。 */
const failures = [];

for (const filePath of sourceFiles) {
  /** 検査対象ファイルのソース文字列。 */
  const sourceText = readFileSync(filePath, "utf8");
  /** TypeScript compiler APIで解析したsource file。 */
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );
  visit(filePath, sourceFile, sourceFile, failures);
}

if (failures.length > 0) {
  console.error("TSDoc check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("TSDoc check passed.");
