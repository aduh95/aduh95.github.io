import { promises as fs } from "fs";

import ts from "typescript";

import tsConfig from "../tsconfig.json" assert { type: "json" };

export default async (fileName) => {
  const { compilerOptions } = tsConfig;

  const { outputText, sourceMapText } = ts.transpileModule(
    await fs.readFile(fileName, "utf8"),
    { compilerOptions, fileName }
  );

  return outputText.replace(
    /# sourceMappingURL=[\w\.]+\.map$/,
    "# sourceMappingURL=data:application/json," + encodeURI(sourceMapText)
  );
};
