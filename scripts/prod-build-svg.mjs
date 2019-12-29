const SVG_TAG = /<svg.*?>.+?<\/svg>/g;

let _svgo = null;
async function svgo(svg) {
  if (_svgo === null) {
    const SVGO = await import("svgo").then(module => module.default);
    _svgo = new SVGO({
      plugins: [
        { removeHiddenElems: false },
        { removeUselessDefs: false },
        { removeXMLNS: true },
        { cleanupIDs: false },
        { convertStyleToAttrs: false },
      ],
    });
  }
  const { data } = await _svgo.optimize(svg);
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

  return Promise.all(promises).then(chunks => chunks.join(""));
}
