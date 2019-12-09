import { getElementCSSFontValue } from "./polyfill.js";

import h from "./createSVGElement.js";

const CIRCULAR_METER = "circular-meter";

const generateSlice = () => {
  return (
    <svg viewBox="0 0 120 120" className="slice" aria-hidden="true">
      <circle className="fill" r="56" cx="60" cy="60" />
      <circle className="bar" r="56" cx="60" cy="60" />
    </svg>
  );
};

class CircularMeterElement extends HTMLElement {
  static from(meterElement: HTMLMeterElement) {
    const circularMeter = document.createElement(CIRCULAR_METER);

    if (meterElement.hasChildNodes()) {
      circularMeter.classList.add("ballooned");
      circularMeter.append(...meterElement.children);
    }

    circularMeter.dataset.title = meterElement.title;
    circularMeter.setAttribute("value", meterElement.value as any);

    // Needed to use CSS hover on iOS (http://www.codehaven.co.uk/fix-css-hover-on-iphone-ipad/)
    circularMeter.setAttribute("onclick", "");

    circularMeter.append(generateSlice() as any);

    meterElement.replaceWith(circularMeter);
  }

  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.style.setProperty(
      "--stroke-dasharray",
      (360 * Number(newValue)) as any
    );
  }
}

customElements.define(CIRCULAR_METER, CircularMeterElement);

window.addEventListener("load", function() {
  // Waiting load event to be sure CSS is fully loaded
  const meterSection = document.querySelectorAll(".meter-section");
  const canvasContext = document
    .createElement("canvas")
    .getContext("2d") as CanvasRenderingContext2D;

  for (const section of meterSection) {
    const titles = section.querySelectorAll("h5");
    // Getting the widths of the title elements
    canvasContext.font = getElementCSSFontValue(titles.item(0));

    const titlesWidth = Array.from(
      titles,
      title => canvasContext.measureText(title.textContent || "").width
    );

    // Computing max width as the min width of all the elements
    // Adding 10px gap as margin
    const minWidth = Math.max(...titlesWidth) + 10 + "px";

    for (const title of titles) {
      title.style.minWidth = minWidth;
    }
  }
});

document.addEventListener(
  "DOMContentLoaded",
  function(this: Document) {
    Array.from(this.querySelectorAll("meter"), CircularMeterElement.from);
  },
  false
);
