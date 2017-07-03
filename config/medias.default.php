<?php

namespace aduh95\Resume\CONFIG\MEDIAS;

CONST HTTP_ROOT = '';

CONST UGLY_JS_SRC = HTTP_ROOT.'/dist/global.min.js';
CONST JS_SRC = HTTP_ROOT.'/dist/global.js';

CONST UGLY_CSS_SRC = HTTP_ROOT.'/dist/global.min.css';
CONST CSS_SRC = HTTP_ROOT.'/dist/global.css';

const VIDEO_DIR = HTTP_ROOT.'/img/';
const IMG_DIR = HTTP_ROOT.'/img/';
const ASSETS_DIR = IMG_DIR.'assets/';
const CONTRIBUTOR_IMG_DIR = IMG_DIR.'contributors/';

const VIDEO_FORMATS = array(
    'video/webm' => 'webm',
    'video/mp4' => 'mp4',
    'video/ogv' => 'ogv',
);
const PHOTO_FORMATS = array('jpeg');

const FAVICON = ASSETS_DIR.'favicon.ico';
