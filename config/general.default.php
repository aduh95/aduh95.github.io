<?php

namespace aduh95\Resume\CONFIG\GENERAL;

define('PROD_ENVIRONMENT', false);

define('PROJECT_ROOT', realpath(__DIR__.'/..'));

const PHP_DIR = PROJECT_ROOT . DIRECTORY_SEPARATOR . 'src';

const VIEWS_DIR = PHP_DIR . DIRECTORY_SEPARATOR . 'views';
const SRC_DIR = PROJECT_ROOT . DIRECTORY_SEPARATOR . 'public';
const CACHE_DIR = PROJECT_ROOT . DIRECTORY_SEPARATOR . 'cache';
const CACHE_PERSISTANT = PROD_ENVIRONMENT;
