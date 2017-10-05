namespace aduh95.resume.circularProgress {
  let insertAfter = function(newNode: Node, referenceNode: Node) {
    if (referenceNode.nextSibling) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
      referenceNode.parentNode.appendChild(newNode);
    }
  };

  let getSlice = () => {
    let slice = document.createElement("div");
    let bar = document.createElement("div");
    let fill = document.createElement("div");
    fill.className = "fill";
    bar.className = "bar";
    slice.className = "slice";

    slice.appendChild(bar);
    slice.appendChild(fill);

    return slice;
  };

  window.addEventListener("load", function() {
    // Waiting load event to be sure CSS is fully loaded
    let meterSection = document.querySelectorAll(".meter-section");
    let canvasContext = document.createElement("canvas").getContext("2d");
    let maxWidth = 0;

    for (let section of <HTMLElement[]>(<any>meterSection)) {
      let titles = section.querySelectorAll("h5");

      // Getting the max width of the title elements
      canvasContext.font = window
        .getComputedStyle(titles.item(0))
        .getPropertyValue("font");
      for (let title of <HTMLElement[]>(<any>titles)) {
        maxWidth = Math.max(
          canvasContext.measureText(title.textContent).width,
          maxWidth
        );
      }

      // Setting computed max width as the min width of all the elements
      for (let title of <HTMLElement[]>(<any>titles)) {
        // Adding 10px gap as margin
        title.style.minWidth = maxWidth + 10 + "px";
      }
    }
  });

  document.addEventListener(
    "DOMContentLoaded",
    function(this: Document) {
      let progressElem = this.querySelectorAll("meter,progress");

      for (let elem of <HTMLMeterElement[]>(<any>progressElem)) {
        let newElem = document.createElement("output");
        if (elem.hasChildNodes()) {
          for (let child of <HTMLElement[]>(<any>elem.children)) {
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
