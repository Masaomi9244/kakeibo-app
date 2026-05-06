import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

const sourceRoot = path.join(process.cwd(), "src");
const requiredFunctionTags = new Set(["description", "example", "param", "returns"]);
const targetExtensions = new Set([".ts", ".tsx"]);
const ignoredFiles = new Set(["next-env.d.ts"]);

const sourceFiles = [];

const collectSourceFiles = (dirPath) => {
  for (const entry of readdirSync(dirPath)) {
    const entryPath = path.join(dirPath, entry);
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

const getJsDocNodes = (node) => node.jsDoc ?? [];

const hasJsDoc = (node) => getJsDocNodes(node).length > 0;

const getTagNames = (node) =>
  new Set(
    getJsDocNodes(node).flatMap((comment) =>
      (comment.tags ?? []).map((tag) => tag.tagName.escapedText),
    ),
  );

const checkFunctionDoc = (filePath, sourceFile, node, label, failures) => {
  const docs = getJsDocNodes(node);
  const tags = getTagNames(node);
  const missingTags = [...requiredFunctionTags].filter((tagName) => !tags.has(tagName));

  if (docs.length === 0 || missingTags.length > 0) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    failures.push(
      `${path.relative(process.cwd(), filePath)}:${line + 1} ${label} is missing TSDoc tags: ${missingTags.join(", ") || "all"}`,
    );
  }
};

const checkTypeDoc = (filePath, sourceFile, node, label, failures) => {
  if (!hasJsDoc(node)) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    failures.push(
      `${path.relative(process.cwd(), filePath)}:${line + 1} ${label} is missing TSDoc`,
    );
  }
};

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
    for (const declaration of node.declarationList.declarations) {
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

  ts.forEachChild(node, (child) => visit(filePath, sourceFile, child, failures));
};

collectSourceFiles(sourceRoot);

const failures = [];

for (const filePath of sourceFiles) {
  const sourceText = readFileSync(filePath, "utf8");
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
