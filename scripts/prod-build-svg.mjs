const SVG_TAG = /<svg.*?>.+?<\/svg>/g;

const config = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeHiddenElems: false,
          removeUselessDefs: false,
          cleanupIds: false,
        },
      },
    },
    { name: "removeXMLNS" },
    { name: "convertStyleToAttrs", active: false },
  ],
};

let _svgo;
async function svgo(svg) {
  if (_svgo == null) {
    _svgo = await import("svgo");
  }
  const { data } = await _svgo.optimize(svg, config);
  return data;
}

export default function minifyInlinedSVG(html) {
  const promises = [];
  let match;
  let lastIndex = 0;
  SVG_TAG.lastIndex = 0;
  while ((match = SVG_TAG.exec(html))) {
    promises.push(html.substring(lastIndex, match.index), svgo(match));
    lastIndex = SVG_TAG.lastIndex;
  }
  promises.push(html.substring(lastIndex));

  return Promise.all(promises).then((chunks) => chunks.join(""));
}
