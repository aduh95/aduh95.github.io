import { BUNDLE_NAME, AUTO_REFRESH_MODULE } from "./dev-config.mjs";
import getRuntimeModules from "./runtime-modules.mjs";

export default indexFile =>
  Promise.all([
    import("jsdom").then(module => module.default.JSDOM.fromFile(indexFile)),
    getRuntimeModules(),
  ]).then(([dom, runTimeModules]) => {
    const { window } = dom;
    const { document } = window;

    const script = document.createElement("script");
    script.textContent = `process={env:${JSON.stringify(process.env)}}`;
    document.head.append(script);

    document.head.append(
      ...[BUNDLE_NAME, AUTO_REFRESH_MODULE]
        .map(name => `./${name}`)
        .concat(runTimeModules.map(([url]) => url))
        .map(relativePath => {
          const scriptTag = document.createElement("script");
          scriptTag.type = "module";
          scriptTag.src = relativePath;
          return scriptTag;
        })
    );
    const noScriptAlert = document.createElement("noscript");
    const removeDialogScript = document.createElement("script");
    const dialog = document.createElement("dialog");
    dialog.open = true;
    dialog.id = "placeholder-dialog";
    dialog.append(
      document.createElement("progress"),
      " Building application...",
      noScriptAlert
    );
    noScriptAlert.append(
      document.createElement("br"),
      document.createElement("br"),
      "Warning, your browser in on no-script mode!"
    );
    removeDialogScript.textContent = `import("./${BUNDLE_NAME}")
        .then(()=>document.getElementById("${dialog.id}").remove())
        .catch(e=>{document.body.textContent=e.message})`;
    document.body.append(dialog, removeDialogScript);
    return dom.serialize();
  });
