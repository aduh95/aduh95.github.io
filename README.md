# Multilingual résumé

[![Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)

### Purpose

The aim of this to project is to build from scratch a software engine generating
a multilingual Résumé, to put into practice my knowledge of web development. You
can see the HTML version on [aduh95.github.io](https://aduh95.github.io/).

Please note I do not wish you to change my work to adapt it for your own
curriculum vitae, but you are welcome to read the source code to help you
build your own.

### Install locally

First, you have to ensure that these dependencies are installed and available on your path:

* [PHP 7](php.net)
* [Yarn](yarnpkg.com)
* [Composer](getcomposer.org)
* [Gulp CLI](gulpjs.com)

I also suggest you to have the Livereload browser extension:

* for [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
* for [Firefox](https://addons.mozilla.org/fr/firefox/addon/livereload/)
* ...

Then you can proceed to the installation:

1. Clone this repository;
2. Run `composer create-project` in the project directory;
3. It's done!

### Run locally

1. Run `gulp` in the project directory;
2. Visit `localhost:8080` with your navigator;
3. *Optional* Activate the **livereload** extension.

To get the standalone version, just run `gulp one-file`.
