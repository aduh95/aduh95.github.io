import Experience from "./views/experience.js";
import Education from "./views/education.js";
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

export default (
  <Document>
    <main>
      <Experience />
      <Education />
    </main>
    <Aside />
  </Document>
).then(e => document.body.append(e));
