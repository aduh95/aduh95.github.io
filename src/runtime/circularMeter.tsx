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

      // Needed to use CSS hover on iOS
      // @see http://www.codehaven.co.uk/fix-css-hover-on-iphone-ipad/
      circularMeter.setAttribute("onclick", "");
      circularMeter.setAttribute("tabindex", "0");
    }

    circularMeter.dataset.title = meterElement.title;
    circularMeter.setAttribute("value", meterElement.value as any);

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

Array.from(document.querySelectorAll("meter"), CircularMeterElement.from);
