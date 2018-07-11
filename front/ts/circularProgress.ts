namespace aduh95.resume.circularProgress {
  const insertAfter = function(newNode: Node, referenceNode: Node) {
    if (referenceNode.nextSibling) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
      referenceNode.parentNode.appendChild(newNode);
    }
  };

  const getSlice = () => {
    const slice = document.createElement("div");
    const bar = document.createElement("div");
    const fill = document.createElement("div");
    fill.className = "fill";
    bar.className = "bar";
    slice.className = "slice";

    slice.appendChild(bar);
    slice.appendChild(fill);

    return slice;
  };

  window.addEventListener("load", function() {
    // Waiting load event to be sure CSS is fully loaded
    const meterSection = document.querySelectorAll(".meter-section");
    const canvasContext = document.createElement("canvas").getContext("2d");

    for (const section of <HTMLElement[]>(<any>meterSection)) {
      const titles = section.querySelectorAll("h5");
      const titlesWidth = [];

      // Getting the widths of the title elements
      canvasContext.font = aduh95.resume.polyfill.getElementCSSFontValue(
        titles.item(0)
      );
      for (const title of <HTMLElement[]>(<any>titles)) {
        titlesWidth.push(canvasContext.measureText(title.textContent).width);
      }

      // Computing max width as the min width of all the elements
      // Adding 10px gap as margin
      const minWidth = Math.max.apply(this, titlesWidth) + 10 + "px";

      for (const title of <HTMLElement[]>(<any>titles)) {
        title.style.minWidth = minWidth;
      }
    }
  });

  document.addEventListener(
    "DOMContentLoaded",
    function(this: Document) {
      const progressElem = this.querySelectorAll("meter,progress");

      for (const elem of <HTMLMeterElement[]>(<any>progressElem)) {
        const newElem = document.createElement("output");
        if (elem.hasChildNodes()) {
          for (const child of <HTMLElement[]>(<any>elem.children)) {
            newElem.appendChild(child.cloneNode(true));
          }
        }
        newElem.appendChild(getSlice());
        newElem.dataset.title = elem.title;

        // Needed to use CSS hover on iOS (http://www.codehaven.co.uk/fix-css-hover-on-iphone-ipad/)
        newElem.setAttribute("onclick", "");

        insertAfter(newElem, elem);
        elem.hidden = true;
      }
    },
    false
  );
}
