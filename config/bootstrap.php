<?php

namespace aduh95\Resume\CONFIG;

use aduh95\Resume\ConfigFileTooOld;

// Récupération des notifs
$dir = scandir(__DIR__);

foreach ($dir as $file) {
    if(strchr($file,'.')==='.default.php') {
        $config=strchr($file,'.',true);
        if (is_readable(__DIR__.DIRECTORY_SEPARATOR.$config.'.config.php')) {
            ConfigFileTooOld::check(__DIR__, $config);
        } else {
            require $file;
        }
    }
}
