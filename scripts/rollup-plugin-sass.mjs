import sass from "sass";
import fiber from "fibers";

function createStyleElement(css, id) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
  style.dataset.file = id;
  return style;
}

export default function plugin() {
  return {
    name: "sass",
    resolveId(source) {
      // this signals that rollup should not ask other plugins or check the file system to find this id
      return source.endsWith(".scss") ? source : null;
    },
    load(id) {
      if (!id.endsWith(".scss")) {
        return null;
      }
      return new Promise((resolve, reject) =>
        sass.render(
          {
            file: id,
            fiber,
            sourceMap: "true",
            sourceMapEmbed: true,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        )
      ).then(
        ({ css }) =>
          `export default (${createStyleElement})(\`${css
            .toString()
            .replace("`", "\\`")}\`,"${id.replace('"', '\\"')}")`
      );
    },
  };
}
