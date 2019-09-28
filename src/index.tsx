import Aside from "./views/aside.js";
import { h, Fragment } from "@aduh95/async-jsx";

import "./index.scss";

const Document = Fragment as any;

declare global {
  namespace JSX {
    interface Element
      extends Promise<DocumentFragment | HTMLElement | SVGElement> {}
  }
}

(
  <Document>
    <Aside />
  </Document>
).then(e => document.body.append(e));
