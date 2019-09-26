import resolve from "rollup-plugin-node-resolve";
import commonJs from "rollup-plugin-commonjs";
import _rollup from "rollup";

const plugins = [resolve(), commonJs()];

const cache = new Map();

export default async function rollup(input) {
  if (!cache.has(input)) {
    const bundle = await _rollup.rollup({
      input,
      plugins,
    });

    const { output } = await bundle.generate({ format: "esm" });

    cache.set(input, output.map(({ code }) => code).join(";"));
  }
  return cache.get(input);
}
