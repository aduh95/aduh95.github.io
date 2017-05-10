<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

require_once '../vendor/autoload.php';


return function ($doc, $section) {
    foreach (JSONSource::parse('experience') as $name => $infos) {
        $list = $section->article()->append()
            ()->h5()->text($name)
            ()->ul();
        if (is_array($infos)) {
            foreach ($infos as $key => $value) {
                $list[] = $doc->createElement('li')->attr('class', $key)->text($value);
            }
        } else {
            $list->append($infos);
        }

    }
};
