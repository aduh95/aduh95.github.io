import SVGO from "svgo";

let _svgo = null;
function svgo(data) {
  if (_svgo === null)
    _svgo = new SVGO({
      plugins: [
        { removeHiddenElems: false },
        { removeUselessDefs: false },
        { removeXMLNS: true },
        { cleanupIDs: false },
        { convertStyleToAttrs: false },
      ],
    });
  return _svgo.optimize(data).then(result => result.data);
}

const SVG_TAG = /<svg.*?>.+?<\/svg>/g;

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
