import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { rollup } from "rollup";
import sass from "./rollup-plugin-sass.mjs";
import { INPUT_DIR } from "./dev-config.mjs";

const plugins = [typescript(), resolve(), commonJs(), json(), sass()];

let cache;

async function buildWithCache(input) {
  const bundle = await rollup({
    input,
    plugins,
    cache,
  });
  cache = bundle.cache;

  return bundle;
}

export default () =>
  buildWithCache(path.join(INPUT_DIR, "index.tsx")).then(bundle =>
    bundle.generate({ sourcemap: "hidden", format: "esm" })
  );
