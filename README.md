# Multilingual résumé

[![Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)

### Purpose

The aim of this to project is to build from scratch a software engine generating
a multilingual Résumé, to put into practice my knowledge of web development. You
can see the HTML version on [aduh95.github.io](https://aduh95.github.io/).

The technical goals I fixed for this project:

- produce an accessible webpage that meets today's standards;
- make sure page makes sense when JS is disabled;
- keep bundled HTML/CSS/JS file size small (currently 20kiB gzipped).

To achieve these goals, I decided to limit my use of external tools to
understand better the build chain and how to build efficient tools: I have
written my own JSX engine, my own plugins for Rollup or PostCSS, my own
bootstrap scrips – don't get me wrong, I'm also using a ton of open-source
resources for this project. I learned a lot writing my own tools, and I
encourage you to do the same on your side projects if you can, it's a lot of
fun!

Please note I do not wish you to change my work to adapt it for your own
curriculum vitae, but you are welcome to read the source code to help you build
your own.

### Run locally

You need [Node.js](https://nodejs.org) 12+ on your local machine for this
project, also [Yarn](https://yarnpkg.com) is recommended.

- `yarn install`: installs the NPM dependencies.
- `yarn start`: starts the development server; run it and visit `localhost:8080`
  with your browser. Then you can modify the `scr` files and your browser will
  reload automatically so you can check your changes.
- `yarn build`: builds the production-ready HTML file and the PDF files.

### File structure

- `/`: root of the webserver; because of
  [some restriction on GitHub Pages](https://help.github.com/en/github/working-with-github-pages/about-github-pages#publishing-sources-for-github-pages-sites),
  the root of the master branch is also the root of the web server.
- `/icons/`: favicon for the web browser.
- `/scripts/`: all the custom scripts used for development and building.
- `/src/`: contains the source code;
  - `/src/index.html`: HTML template, you can add HTML tags in the header from
    here.
  - `/src/index.tsx`: root of the "compile-time" code; this module will be
    imported from the HTML template, and all changes it made to the DOM before
    its exported promise resolves will be kept in the final file. N.B.: you
    cannot define any runtime logic (event handler, etc.) here.
  - `/src/data/`: the data files describing each part of the résumé.
  - `/src/runtime/`: TypeScript modules that are sent to the client, for better
    interactivity. N.B.: all the files in this folder are _magically_ bundled in
    the final file.
  - `/src/views/`: TSX modules and SASS files that defines the HTML structure
    and the styles of the web page – those will not be run on the client; at
    build time, they will be parsed, executed, applied to the HTML template, and
    only the resulting DOM tree will be saved.
