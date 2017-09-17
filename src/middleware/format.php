<?php

namespace aduh95\Resume\format;

use aduh95\Resume\CONFIG\MEDIAS;

/**
 * Checks if the string given is a valid email address
 *
 * @param  string $mail The input to check
 * @return boolean The result of the test
 */
function is_email(string $mail)
{
    return filter_var($mail, FILTER_VALIDATE_EMAIL);
}

/**
 * Transforms a path into a navigator friendly link
 *
 * @param  string $path Can be a local path (ex: /home/user/www/file) inside the Document Root, or a distant one
 * N.B.: This function assumes ~ to be the Document Root
 * @return string The URI corresponding to the path
 */
function link(string $path)
{
    return $path;
}

const IMG = 1;

const SVG = 5;
const JPEG = 6;
const PNG = 7;

/**
 * Gets the url of a media file
 *
 * @param  string $file The file to include
 * @param  int    $type The constant corresponding to your file type to find the directory it should be stored
 * @return string The URI
 */
function getHref($file, int $type = 0)
{
    return [
            MEDIAS\HTTP_ROOT,
            IMG => MEDIAS\IMG_DIR,

            SVG => MEDIAS\IMG_DIR,
            JPEG => MEDIAS\IMG_DIR,
            PNG => MEDIAS\IMG_DIR,
        ][$type].$file;
}
