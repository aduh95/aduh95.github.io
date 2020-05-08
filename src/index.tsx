import { h, Fragment } from "@aduh95/async-jsx";

import Aside from "./views/aside.js";
import Education from "./views/education.js";
import Experience from "./views/experience.js";
import Header from "./views/header.js";
import Languages from "./views/languages.js";
import ProgrammingLanguages from "./views/programming_languages.js";

import easter_egg from "./views/easter_egg.js";

import "./index.scss";

const Document = Fragment as any;

declare global {
  namespace JSX {
    interface Element
      extends Promise<DocumentFragment | HTMLElement | SVGElement> {}
  }
}

document.head.append(easter_egg);

export default (
  <Document>
    <Header />
    <main>
      <Experience />
      <Education />
      <Languages />
      <ProgrammingLanguages />
    </main>
    <Aside />
  </Document>
).then((e) => document.body.append(e));
