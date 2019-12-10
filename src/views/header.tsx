import { h } from "@aduh95/async-jsx";

import { AUTHOR_NAME } from "../config.json";

export default () => (
  <header>
    <h1>{AUTHOR_NAME}</h1>
    <h5 lang="en">IT electronic engineer specialized in web development</h5>
    <h5 lang="fr">
      Étudiant Ingénieur Diplômé en informatique et électronique, spécialisé en
      développement web
    </h5>
  </header>
);
