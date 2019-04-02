<?php

$PROD_DIR = realpath('.');
$DEV_DIR = $PROD_DIR . DIRECTORY_SEPARATOR . 'public';

if (file_exists($DEV_DIR . DIRECTORY_SEPARATOR . $_SERVER["REQUEST_URI"])) {
    return false;    // serve the requested resource as-is 
} elseif(file_exists($filename = $PROD_DIR . DIRECTORY_SEPARATOR . $_SERVER["REQUEST_URI"])) {
    if (substr($filename, -2) === 'js') {
        header('Content-Type: application/javascript');
    } else if (substr($filename, -4) === 'json') {
        header('Content-Type: application/manifest+json');
    } else if (substr($filename, -3) === 'jpg') {
        header('Content-Type: image/jpeg');
    }
    readfile($filename);
    error_log($filename);
} else {
    return false;
}