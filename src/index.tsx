import Aside from "./views/aside.js";
import { h, Fragment } from "@aduh95/async-jsx";

const Document = Fragment as any;

declare global {
  namespace JSX {
    interface Element
      extends Promise<DocumentFragment | HTMLElement | SVGElement> {}
  }
}

export default () => (
  <Document>
    <Aside />
  </Document>
);
