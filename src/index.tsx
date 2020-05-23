import { h, Fragment } from "@aduh95/async-jsx";

import Aside from "./views/aside.js";
import Education from "./views/education.js";
import Experience from "./views/experience.js";
import Header from "./views/header.js";
import Languages from "./views/languages.js";
import ProgrammingLanguages from "./views/programming_languages.js";

import Footer from "./views/footer.js";

import easter_egg from "./views/easter_egg.js";

import "./index.scss";

const Body = Fragment as any;

export default (
  <Body>
    <Header />
    <main>
      <Experience />
      <Education />
      <Languages />
      <ProgrammingLanguages />
    </main>
    <Aside />
    <Footer />
  </Body>
).then((e) => document.body.append(e));

document.head.append(easter_egg);

declare global {
  namespace JSX {
    interface Element
      extends Promise<DocumentFragment | HTMLElement | SVGElement> {}
  }
}
