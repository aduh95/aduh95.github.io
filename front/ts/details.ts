interface HTMLDetailsElement extends HTMLElement {
  open: boolean;
}

document.addEventListener(
  "DOMContentLoaded",
  function(this: Document) {
    const SUMMARY_ELEMENT = "SUMMARY";
    const detailsSupport = window.hasOwnProperty("HTMLDetailsElement");
    let summaryElem = this.querySelectorAll(SUMMARY_ELEMENT);
    for (let elem of <HTMLElement[]>(<any>summaryElem)) {
      if (detailsSupport) {
        // Allow the user to close the detail element by clicking on it
        // And add smooth transition when elements are changing height
        elem.parentNode.addEventListener(
          "click",
          function(this: HTMLDetailsElement, ev: Event) {
            if (this.open) {
              // Compute the actual height of the element before
              // the transition starts
              this.style.height = this.offsetHeight + "px";
              window.requestAnimationFrame(() => {
                // Waiting for the next frame because of Firefox
                window.requestAnimationFrame(() => {
                  // Set the height at the last known to start the transition
                  this.style.height = this.style.minHeight;
                });
              });
              ev.target.addEventListener(
                "transitionend",
                (event: TransitionEvent) => {
                  // At the end of the transition, removing the
                  // height style attribute to let the browser
                  // chose the best height
                  this.style.height = "";
                  this.style.minHeight = "";
                },
                { once: true, passive: true }
              );
            } else {
              // Saving the current height to allow sweet transition
              this.style.minHeight =
                (<HTMLElement>this.firstElementChild).offsetHeight + "px";
            }
            if (
              SUMMARY_ELEMENT !== (<HTMLElement>ev.target).nodeName &&
              this.open
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
