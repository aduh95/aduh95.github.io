import { promises as fs } from "fs";
import { createRequire } from "module";
import { pathToFileURL } from "url";
import vm from "vm";
import rollup from "./rollup.mjs";

function createVMModuleFromString(scriptContent, { context, url }) {
  return new vm.SourceTextModule(scriptContent, {
    context,
    url,
  });
}

const cache = new Map();
async function createVMModuleFromPath(scriptPath, { context }) {
  if (!cache.has(scriptPath)) {
    const scriptContent = await fs.readFile(scriptPath, "utf8");

    cache.set(
      scriptPath,
      createVMModuleFromString(scriptContent, {
        context,
        url: pathToFileURL(scriptPath).toString(),
      })
    );
  }
  return cache.get(scriptPath);
}

async function nodeResolver(require, specifier, referencingModule) {
  try {
    const { module } = require(specifier + "/package.json");
    return createVMModuleFromPath(
      require.resolve(`${specifier}/${module}`),
      referencingModule
    );
  } catch {
    const url = require.resolve(specifier);
    return createVMModuleFromString(await rollup(url), {
      context: referencingModule.context,
      url,
    });
  }
}

function linker(specifier, referencingModule) {
  const require = createRequire(referencingModule.url);
  if (specifier.endsWith(".json")) {
    const jsonFile = require(specifier);

    return createVMModuleFromString(
      typeof jsonFile !== "object" || Array.isArray(jsonFile)
        ? `export default ${JSON.stringify(jsonFile)}`
        : Object.entries(jsonFile)
            .map(
              ([key, value]) => `export const ${key}=${JSON.stringify(value)}`
            )
            .join(";") + `;export default{${Object.keys(jsonFile).join(",")}}`,
      referencingModule
    );
  } else {
    try {
      if (!specifier.startsWith(".")) {
        throw specifier;
      }
      return createVMModuleFromPath(
        require.resolve(specifier),
        referencingModule
      );
    } catch {
      return nodeResolver(require, specifier, referencingModule);
    }
  }
}

async function addCustomElementsPolyfill(context) {
  const require = createRequire(import.meta.url);
  const scriptPath = require.resolve("@webcomponents/custom-elements");

  vm.runInContext(await fs.readFile(scriptPath, "utf8"), context);
}

export default async function runModule(window, scriptURL) {
  window.process = { env: process.env };
  const context = vm.createContext(window);

  await addCustomElementsPolyfill(context);

  const module = await createVMModuleFromPath(scriptURL, { context });

  await module.link(linker);
  module.instantiate();

  return module.evaluate();
}
