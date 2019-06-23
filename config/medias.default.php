<?php

namespace aduh95\Resume\CONFIG\MEDIAS;

const HTTP_ROOT = '';

const UGLY_JS_SRC = HTTP_ROOT.'/dist/global.min.js';
const JS_SRC = HTTP_ROOT.'/dist/global.js';

// "AMD" lite module loader
const JS_MODULE_LOADER = '(function(){var n={};define=function(i,o,c){c.apply(this,o.map(function() {return n}))}})()';

const UGLY_CSS_SRC = HTTP_ROOT.'/dist/global.min.css';
const CSS_SRC = HTTP_ROOT.'/dist/global.css';

const IMG_DIR = HTTP_ROOT;
const PHOTO_FORMATS = array('jpeg');

const FAVICON = HTTP_ROOT.'icons/';
