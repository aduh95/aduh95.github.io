import typescript from "@rollup/plugin-sucrase";

import tsConfig from "../tsconfig.json" assert { type: "json" };

export default (sourceMap = undefined) =>
  typescript({
    jsxFragmentPragma: tsConfig.compilerOptions.jsxFragmentFactory,
    jsxPragma: tsConfig.compilerOptions.jsxFactory,
    transforms: ["jsx", "typescript"],
    disableESTransforms: true,
    include: ["**.tsx", "**.ts"],
    production: true,
    sourceMap,
  });
