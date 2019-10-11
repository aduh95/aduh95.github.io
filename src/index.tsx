import Experience from "./views/experience.js";
import Education from "./views/education.js";
import Languages from "./views/languages.js";
import ProgramingLanguages from "./views/programing_languages.js";
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
    <header>
      <h1>Antoine du Hamel</h1>
      <h5 lang="en">
        IT electronic engineering student specialized in web development
      </h5>
      <h5 lang="fr">
        Étudiant Ingénieur en informatique et électronique, spécialisé en
        développement web
      </h5>
    </header>
    <main>
      <Experience />
      <Education />
      <Languages />
      <ProgramingLanguages />
    </main>
    <Aside />
  </Document>
).then(e => document.body.append(e));
