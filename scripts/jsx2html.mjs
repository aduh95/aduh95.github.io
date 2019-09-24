import { promises as fs } from "fs";
// import path from "path";
import vm from "vm";
import { pathToFileURL } from "url";
import { createRequire } from "module";

function createVMModuleFromString(scriptContent, { context, url }) {
  return new vm.SourceTextModule(scriptContent, {
    context,
    url,
  });
}

async function createVMModuleFromPath(scriptPath, { context }) {
  const scriptContent = await fs.readFile(scriptPath, "utf8");

  return createVMModuleFromString(scriptContent, {
    context,
    url: pathToFileURL(scriptPath).toString(),
  });
}

async function linker(specifier, referencingModule) {
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
            .join(";") + `;export default {${Object.keys(jsonFile).join(",")}}`,
      referencingModule
    );
  } else {
    let scriptPath;
    try {
      scriptPath = require.resolve(specifier);
    } catch {
      const { module } = require(specifier + "/package.json");
      scriptPath = require.resolve(specifier + "/" + module);
    }

    return createVMModuleFromPath(scriptPath, referencingModule);
  }
}

export default async function runModule(window, scriptPath) {
  const context = vm.createContext(window);

  const module = await createVMModuleFromPath(scriptPath, { context });

  await module.link(linker);
  module.instantiate();

  return module.evaluate();
}
