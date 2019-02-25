document.addEventListener(
  "DOMContentLoaded",
  function(this: Document) {
    const SUMMARY_ELEMENT = "SUMMARY";
    const MOVABLE_ELEMENT_CLASS = "movable-element";
    const MOVING_ELEMENTS_CLASS = "moving-elements";
    const detailsSupport = window.hasOwnProperty("HTMLDetailsElement");
    const summaryElem: NodeListOf<HTMLElement> = this.querySelectorAll(
      SUMMARY_ELEMENT
    );

    const animateElementsBelow = (
      parentElement: HTMLElement,
      height: number,
      callback: Function
    ) => {
      // The goal of this function is to make the animation smoother using JS than
      // the one using only CSS. However, if the user disables JS, the animation still works.
      const articleIndex = Array.prototype.indexOf.call(
        document.querySelectorAll("main>.experience>*"),
        parentElement
      );
      const movableElements = document.querySelectorAll(
        [
          "main>.experience~section",
          `main>.experience>article:nth-child(n + ${articleIndex + 2})`,
          `main>.experience>article:nth-child(${articleIndex + 1})>details+*`,
        ].join(",")
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

    for (const elem of summaryElem) {
      if (detailsSupport) {
        // Allow the user to close the detail element by clicking on it
        // And add smooth transition when elements are changing height
        elem.parentNode.addEventListener(
          "click",
          function(this: HTMLDetailsElement, ev: Event) {
            const shouldClose = this.open && window.getSelection().isCollapsed;
            if (shouldClose) {
              // Compute the actual height of the element before
              // the transition starts
              const currentHeight = this.offsetHeight;
              this.style.height = currentHeight + "px";
              window.requestAnimationFrame(() => {
                const minHeight = parseInt(this.style.minHeight.slice(0, -2));

                animateElementsBelow(
                  this.parentElement,
                  minHeight - currentHeight,
                  () => {
                    // Set the height at the last known to start the transition
                    this.style.height = "";
                    this.style.minHeight = "";
                  }
                );
              });
            } else {
              const summaryHeight = (<HTMLElement>this.firstElementChild)
                .offsetHeight;

              // Unsetting the height in case the transition did not end
              this.style.height = "";

              // Saving the current height to allow sweet transition
              this.style.minHeight = summaryHeight + "px";

              // Selecting the paragraph that will appear
              const paragraph = <HTMLElement>(
                this.querySelector(
                  `p[lang='${document.documentElement.getAttribute("lang")}']`
                )
              );

              // Hiding the paragraph to compute its height
              paragraph.style.opacity = "0";
              paragraph.style.position = "absolute";
              paragraph.style.animation = "unset";

              // Waiting for the paragraph to appear next frame
              requestAnimationFrame(() => {
                const { height } = paragraph.getBoundingClientRect();

                // Triggers CSS animation
                animateElementsBelow(
                  this.parentElement,
                  height - summaryHeight,
                  () => {
                    paragraph.style.removeProperty("position");
                  }
                );

                // The paragraph can re-appear and make its transition now we know its height
                paragraph.style.removeProperty("opacity");
                paragraph.style.removeProperty("animation");
              });
            }
            if (
              SUMMARY_ELEMENT !== (<HTMLElement>ev.target).nodeName &&
              shouldClose
            ) {
              this.open = false;
            }
          },
          true
        );
      } else {
        // For browsers that do not support <details>, let's hide the summaries
        elem.hidden = true;
      }
    }
  },
  false
);
