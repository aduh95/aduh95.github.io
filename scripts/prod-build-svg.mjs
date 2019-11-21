import SVGO from "svgo";

let _svgo = null;
function svgo(data) {
  if (_svgo === null)
    _svgo = new SVGO({
      plugins: [{ removeHiddenElems: false }, { removeUselessDefs: false }],
    });
  return _svgo.optimize(data).then(result => result.data);
}

const SVG_TAG = /<svg.*?>.+?<\/svg>/g;

export default function minifyInlinedSVG(html) {
  const promises = [];
  let match;
  while ((match = SVG_TAG.exec(html))) {
    promises.push(svgo(match));
  }

  return Promise.all(promises).then(optimisedSVGs =>
    html.split(SVG_TAG).reduce((pv, cv) => pv + cv + optimisedSVGs.shift(), "")
  );
}
