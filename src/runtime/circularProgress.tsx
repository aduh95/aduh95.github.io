import { getElementCSSFontValue } from "./polyfill.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

interface Props {
  ref: { current: Node };
  style?:
    | string
    | {
        [propertyName: string]: string;
      };
  [key: string]: any;
}

function h(element: string, props: Props | null = null, ...children: any) {
  const domElement = document.createElementNS(SVG_NAMESPACE, element);

  if (props) {
    if ("object" === typeof props.style) {
      Object.entries(props.style).forEach(([propertyName, value]) =>
        domElement.style.setProperty(propertyName, value)
      );
      props.style = undefined;
    }
    if (props.className) {
      // className is read-only on SVGElement
      // @see https://svgwg.org/svg2-draft/types.html#InterfaceSVGElement
      domElement.setAttribute("class", props.className);
      props.className = undefined;
    }
    Object.entries(props)
      .filter(([name, value]) => value !== undefined)
      .forEach(([name, value]) => domElement.setAttribute(name, value));
  }

  if (children.length) {
    const subElements: Node[] = children.flat(Infinity);
    domElement.append(...subElements.filter(Boolean));
  }

  return domElement;
}

const generateSlice = () => {
  return (
    <svg viewBox="0 0 120 120" className="slice">
      <circle className="fill" r="56" cx="60" cy="60" />
      <circle className="bar" r="56" cx="60" cy="60" />
    </svg>
  );
};

class CustomMeterElement extends HTMLMeterElement {
  private _circularMeter = this.createOutputElement();

  createOutputElement() {
    const newElem = document.createElement("output");
    if (this.hasChildNodes()) {
      newElem.append(
        ...Array.from(this.children, child => child.cloneNode(true))
      );
    }
    newElem.append(generateSlice() as any);
    newElem.dataset.title = this.title;

    // Needed to use CSS hover on iOS (http://www.codehaven.co.uk/fix-css-hover-on-iphone-ipad/)
    newElem.setAttribute("onclick", "");

    this.hidden = true;

    return newElem;
  }

  connectedCallback() {
    if (this.isConnected) {
      this.after(this._circularMeter);
    }
  }

  disconnectedCallback() {
    this._circularMeter.remove();
  }
}

customElements.define("circular-meter", CustomMeterElement, {
  extends: "meter",
});

// window.addEventListener("load", function() {
//   // Waiting load event to be sure CSS is fully loaded
//   const meterSection = document.querySelectorAll(".meter-section");
//   const canvasContext = document
//     .createElement("canvas")
//     .getContext("2d") as CanvasRenderingContext2D;

//   for (const section of meterSection) {
//     const titles = section.querySelectorAll("h5");
//     const titlesWidth = [];

//     // Getting the widths of the title elements
//     canvasContext.font = getElementCSSFontValue(titles.item(0));
//     for (const title of titles) {
//       titlesWidth.push(
//         canvasContext.measureText(title.textContent || "").width
//       );
//     }

//     // Computing max width as the min width of all the elements
//     // Adding 10px gap as margin
//     const minWidth = Math.max.apply(this, titlesWidth) + 10 + "px";

//     for (const title of titles) {
//       title.style.minWidth = minWidth;
//     }
//   }
// });

// document.addEventListener(
//   "DOMContentLoaded",
//   function(this: Document) {
//     const progressElem: NodeListOf<
//       HTMLMeterElement | HTMLProgressElement
//     > = this.querySelectorAll("meter,progress");

//     for (const elem of progressElem) {

//     }
//   },
//   false
// );
