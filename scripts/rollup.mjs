import resolve from "rollup-plugin-node-resolve";
import commonJs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import sass from "rollup-plugin-sass";
import runtime from "sass";
import typescript from "rollup-plugin-typescript2";
import _rollup from "rollup";

const plugins = [
  typescript(),
  resolve(),
  commonJs(),
  json(),
  sass({ insert: true, runtime }),
];

let cache;

async function buildWithCache(input) {
  const bundle = await _rollup.rollup({
    input,
    plugins,
    // preserveModules: true,
  });
  cache = bundle.cache;

  return bundle;
}

export default (input, output) =>
  buildWithCache(input)
    .then(bundle =>
      bundle.write({ file: output, sourcemap: true, format: "esm" })
    )
    .then(console.log(output, typeof output));
