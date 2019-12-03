import { getElementCSSFontValue } from "./polyfill.js";
import getCurrentLocale from "./i18n.js";

const SUMMARY_ELEMENT = "SUMMARY";
const EXPERIENCE_SECTION = "main>.experience";
const MOVABLE_ELEMENT_CLASS = "movable-element";
const MOVING_ELEMENTS_CLASS = "moving-elements";

const reduceAnimations = window.matchMedia("(prefers-reduced-motion: reduce)");

const animateElementsBelow = (
  parentElement: HTMLElement,
  height: number,
  callback: Function
) => {
  // The goal of this function is to make the animation smoother using JS than
  // the one using only CSS. However, if the user disables JS, the animation still works.
  const articleIndex = Array.prototype.indexOf.call(
    document.querySelectorAll(`${EXPERIENCE_SECTION}>*`),
    parentElement
  );
  const movableElements = document.querySelectorAll(
    [
      "~section",
      `>article:nth-child(n + ${articleIndex + 2})`,
      `>article:nth-child(${articleIndex + 1})>details~*`,
    ]
      .map(selector => EXPERIENCE_SECTION + selector)
      .join(",")
  );

  document.body.style.setProperty("--movable-height", height + "px");
  document.body.classList.add(MOVING_ELEMENTS_CLASS);
  parentElement.classList.add(MOVABLE_ELEMENT_CLASS + "-after");
  for (const movableElement of movableElements) {
    movableElement.classList.add(MOVABLE_ELEMENT_CLASS);
  }

  // When the animation has ended, cleaning up
  movableElements.item(0).addEventListener(
    "transitionend",
    () => {
      callback();
      parentElement.classList.remove(MOVABLE_ELEMENT_CLASS + "-after");
      for (const movableElement of movableElements) {
        movableElement.classList.remove(MOVABLE_ELEMENT_CLASS);
      }
      document.body.classList.remove(MOVING_ELEMENTS_CLASS);
    },
    { once: true, passive: true }
  );
};

document.addEventListener(
  "DOMContentLoaded",
  function(this: Document) {
    const paragraphElement = document.querySelector(".experience p") as Element;
    const LINE_HEIGHT = parseInt(
      window.getComputedStyle(paragraphElement).lineHeight || "20"
    );

    const summaryElem: NodeListOf<HTMLElement> = this.querySelectorAll(
      SUMMARY_ELEMENT
    );

    if (!window.hasOwnProperty("HTMLDetailsElement")) {
      // For browsers that do not support <details>, let's hide the summaries
      // and return to exit the function
      return Array.from(summaryElem, elem => {
        elem.hidden = true;
      });
    }

    const canvasContext = document
      .createElement("canvas")
      .getContext("2d") as CanvasRenderingContext2D;

    canvasContext.font = getElementCSSFontValue(paragraphElement);

    for (const elem of summaryElem) {
      // Allow the user to close the detail element by clicking on it
      // And add smooth transition when elements are changing height
      (elem.parentNode as Element).addEventListener(
        "click",
        function(this: HTMLDetailsElement, ev: Event) {
          if (!(window.getSelection() || ({} as never)).isCollapsed) {
            // If the click results of a user selection, don't do anything
            return;
          }
          if (reduceAnimations.matches) {
            // Disable animations if user prefers without
          } else if (this.open) {
            // The details should close (collapse) only if it's already open
            // Compute the actual height of the element before
            // the transition starts
            const currentHeight = this.offsetHeight;
            this.style.height = currentHeight + "px";
            window.requestAnimationFrame(() => {
              const minHeight = parseInt(this.style.minHeight as string);

              animateElementsBelow(
                this.parentElement as HTMLElement,
                minHeight - currentHeight,
                () => {
                  // Set the height at the last known to start the transition
                  this.style.height = "";
                  this.style.minHeight = "";
                }
              );
            });
          } else {
            // The element is already closed, it's gonna open but first let's
            // try to put a nice transition in place.
            const visibleSummary = this.querySelector(
              `span[lang="${getCurrentLocale().lang}"]`
            ) as Element;
            const {
              height: summaryHeight,
              width: summaryWidth,
            } = visibleSummary.getBoundingClientRect();

            // Removing CSS height in case the transition did not end
            this.style.height = "";

            // Saving the current height to allow sweet transition
            this.style.minHeight = summaryHeight + "px";

            // Selecting the paragraph that will appear
            const paragraph = this.querySelector(
              `p[lang='${document.documentElement.getAttribute("lang")}']`
            ) as HTMLElement;

            const estimatedHeight =
              Math.ceil(
                (canvasContext.measureText(
                  paragraph.textContent || ("" as never)
                ).width *
                  1.1) / // Allow 10% error due to line breaks
                  summaryWidth
              ) * LINE_HEIGHT;

            // Triggers CSS animation
            paragraph.style.position = "absolute";
            animateElementsBelow(
              this.parentElement as HTMLElement,
              estimatedHeight - summaryHeight,
              () => {
                paragraph.style.removeProperty("position");
              }
            );
          }

          if (
            SUMMARY_ELEMENT !== (ev.target as HTMLElement).nodeName &&
            this.open
          ) {
            // Allows user to close the details by clicking on any children
            // (only the summary element has this behavior by default)
            this.open = false;
          }
        },
        true
      );
    }
  },
  false
);
