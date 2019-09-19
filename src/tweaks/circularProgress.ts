import { getElementCSSFontValue } from "./polyfill";

const SVGNamespace = "http://www.w3.org/2000/svg";

const generateSlice = () => {
  const slice = document.createElementNS(SVGNamespace, "svg");
  const bar = document.createElementNS(SVGNamespace, "circle");
  const fill = document.createElementNS(SVGNamespace, "circle");
  slice.setAttribute("viewBox", "0 0 120 120");
  fill.setAttribute("class", "fill");
  bar.setAttribute("class", "bar");
  slice.setAttribute("class", "slice");

  fill.setAttribute("r", "56");
  bar.setAttribute("r", "56");
  bar.setAttribute("cx", "60");
  bar.setAttribute("cy", "60");
  fill.setAttribute("cy", "60");
  fill.setAttribute("cx", "60");

  slice.appendChild(fill);
  slice.appendChild(bar);

  return slice;
};

window.addEventListener("load", function() {
  // Waiting load event to be sure CSS is fully loaded
  const meterSection = document.querySelectorAll(".meter-section");
  const canvasContext = document
    .createElement("canvas")
    .getContext("2d") as CanvasRenderingContext2D;

  for (const section of meterSection) {
    const titles = section.querySelectorAll("h5");
    const titlesWidth = [];

    // Getting the widths of the title elements
    canvasContext.font = getElementCSSFontValue(titles.item(0));
    for (const title of titles) {
      titlesWidth.push(
        canvasContext.measureText(title.textContent || "").width
      );
    }

    // Computing max width as the min width of all the elements
    // Adding 10px gap as margin
    const minWidth = Math.max.apply(this, titlesWidth) + 10 + "px";

    for (const title of titles) {
      title.style.minWidth = minWidth;
    }
  }
});

document.addEventListener(
  "DOMContentLoaded",
  function(this: Document) {
    const progressElem: NodeListOf<
      HTMLMeterElement | HTMLProgressElement
    > = this.querySelectorAll("meter,progress");

    for (const elem of progressElem) {
      const newElem = document.createElement("output");
      if (elem.hasChildNodes()) {
        for (const child of elem.children) {
          newElem.appendChild(child.cloneNode(true));
        }
      }
      newElem.appendChild(generateSlice());
      newElem.dataset.title = elem.title;

      // Needed to use CSS hover on iOS (http://www.codehaven.co.uk/fix-css-hover-on-iphone-ipad/)
      newElem.setAttribute("onclick", "");

      elem.after(newElem);
      elem.hidden = true;
    }
  },
  false
);
