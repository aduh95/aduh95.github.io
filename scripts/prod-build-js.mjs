import typescript from "rollup-plugin-typescript2";
import _rollup from "rollup";

import getRuntimeScripts from "./getRuntimeScripts.mjs";

const plugins = [typescript()];

export default () =>
  getRuntimeScripts()
    .then(scripts => scripts.map(([_, path]) => path))
    .then(input =>
      _rollup
        .rollup({
          input,
          plugins,
          // preserveModules: true,
        })
        .then(bundle => bundle.generate({ sourcemap: false, format: "amd" }))
    );
