import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { rollup } from "rollup";
import sass from "./rollup-plugin-sass.mjs";
import toml from "./rollup-plugin-toml.mjs";
import { INPUT_DIR } from "./dev-config.mjs";

const plugins = [typescript(), resolve(), sass(), toml()];

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
  buildWithCache(path.join(INPUT_DIR, "index.tsx")).then((bundle) =>
    bundle.generate({ sourcemap: "hidden", format: "esm" })
  );
