<?php
/**
 * Loads the function files
 */
namespace aduh95\Resume;

$dir = scandir(__DIR__);

foreach ($dir as $file) {
    if (strrchr($file, '.php')==='.php') {
        include_once __DIR__.DIRECTORY_SEPARATOR.$file;
    }
}
