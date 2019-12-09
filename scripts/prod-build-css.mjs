import postcss from "postcss";
import cssnano from "cssnano";

const removeUselessFARules = postcss.plugin(
  "postcss-remove-unused-font-awesome-rules-plugin",
  function(opts) {
    const isFASelector = /\.fa-[_a-zA-Z0-9-]+/g;
    opts = opts || {};
    opts.usedFaSelectors = opts.usedFaSelectors || [];

    return function(root, result) {
      // Transform CSS AST here
      root.walkRules(rule => {
        if (
          isFASelector.test(rule.selector) &&
          !rule.selectors
            .flatMap(selector =>
              Array.from(selector.match(isFASelector), selector =>
                selector.substring(1)
              )
            )
            .find(className => opts.usedFaSelectors.includes(className))
        ) {
          // If it's a font-awesome selector and it's not used
          rule.remove();
        }
      });
    };
  }
);

const mergeDarkModeRules = postcss.plugin(
  "postcss-merge-dark-mode-rules",
  opts => (root, result) => {
    const mediaQuery = "screen and (prefers-color-scheme: dark)";
    const wrapper = postcss.atRule({
      name: "media",
      params: mediaQuery,
    });
    root.walkAtRules("media", (rule, index) => {
      if (rule.params === mediaQuery) {
        rule.walkRules(rule => wrapper.append(rule));
      }
    });
    root.append(wrapper);
  }
);

export default (css, usedFaSelectors) =>
  postcss([
    removeUselessFARules({ usedFaSelectors }),
    mergeDarkModeRules(),
    cssnano({ preset: ["advanced"] }),
  ])
    .process(css, { from: undefined, map: { annotation: false } })
    .then(result => result.css);
