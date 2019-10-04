import { createRequire } from "module";
import { promises as fs } from "fs";
import ts from "typescript";

const require = createRequire(import.meta.url);

const { compilerOptions } = require("../tsconfig.json");
export default source =>
  fs
    .readFile(source, "utf8")
    .then(source =>
      ts.transpileModule(source, {
        compilerOptions,
      })
    )
    .then(({ outputText, sourceMapText }) =>
      outputText.replace(
        /# sourceMappingURL=[\w\.]+\.map$/,
        "# sourceMappingURL=data:application/json," + encodeURI(sourceMapText)
      )
    );
