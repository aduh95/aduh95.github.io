import postcss from "postcss";
import cssnano from "cssnano";

const removeUselessFARules = function (opts) {
  const isFASelector = /\.fa-[_a-zA-Z0-9-]+/g;
  opts = opts || {};
  opts.usedFaSelectors = opts.usedFaSelectors || [];

  return {
    postcssPlugin: "postcss-remove-unused-font-awesome-rules-plugin",
    Rule(rule) {
      // Transform CSS AST here
      if (
        isFASelector.test(rule.selector) &&
        !rule.selectors
          .flatMap((selector) =>
            Array.from(selector.match(isFASelector), (selector) =>
              selector.substring(1)
            )
          )
          .find((className) => opts.usedFaSelectors.includes(className))
      ) {
        // If it's a font-awesome selector and it's not used
        rule.remove();
      }
    },
  };
};

const mergeDarkModeRules = function () {
  return {
    postcssPlugin: "postcss-merge-dark-mode-rules",
    Once(root) {
      const mediaQuery = "screen and (prefers-color-scheme: dark)";
      const wrapper = postcss.atRule({
        name: "media",
        params: mediaQuery,
      });
      root.walkAtRules("media", (rule, index) => {
        if (rule.params === mediaQuery) {
          rule.walkRules((rule) => wrapper.append(rule));
        }
      });
      root.append(wrapper);
    },
  };
};

export default (css, usedFaSelectors) =>
  postcss([
    removeUselessFARules({ usedFaSelectors }),
    mergeDarkModeRules,
    cssnano({ preset: ["advanced"] }),
  ])
    .process(css, { from: undefined, map: { annotation: false } })
    .then((result) => result.css);
