import { createRequire } from "module";
import { promises as fs } from "fs";
import ts from "typescript";

const require = createRequire(import.meta.url);

const { compilerOptions } = require("../tsconfig.json");
export default fileName =>
  fs
    .readFile(fileName, "utf8")
    .then(tsModule =>
      ts.transpileModule(tsModule, {
        compilerOptions,
        fileName,
      })
    )
    .then(({ outputText, sourceMapText }) =>
      outputText.replace(
        /# sourceMappingURL=[\w\.]+\.map$/,
        "# sourceMappingURL=data:application/json," + encodeURI(sourceMapText)
      )
    );
