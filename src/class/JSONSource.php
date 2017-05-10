<?php

namespace aduh95\Resume;

use const aduh95\Resume\CONFIG\GENERAL\JSON_DIR;

/**
 * Translate JSON files into array
 */
class JSONSource
{
    public static function parse($file_name)
    {
        return json_decode(file_get_contents(JSON_DIR . DIRECTORY_SEPARATOR . $file_name . '.json'), true);
    }
}
