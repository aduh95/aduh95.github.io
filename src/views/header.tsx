import { h } from "@aduh95/async-jsx";

import { AUTHOR_NAME, description } from "../data/header.toml";

export default () => (
  <header>
    <h1>{AUTHOR_NAME}</h1>
    {Object.entries(description).map(([lang, description]) => (
      <h5 lang={lang}>{description}</h5>
    ))}
  </header>
);
