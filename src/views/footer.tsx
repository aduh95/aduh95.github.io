import { h } from "@aduh95/async-jsx";
import { AUTHOR_NAME } from "../data/header.toml";
const sourceLocation = "https://github.com/aduh95/aduh95.github.io/";

import "./footer.scss";

export default function Footer() {
  return (
    <footer>
      © 2020 {AUTHOR_NAME} –{" "}
      <a lang="en" target="_blank" rel="noopener" href={sourceLocation}>
        View the code
      </a>
      <a lang="fr" target="_blank" rel="noopener" href={sourceLocation}>
        Voir code source
      </a>
    </footer>
  );
}
