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

        foreach ($infos['info'] as $key => $value) {
            $list[] = $doc->createElement('li')->attr('class', $key)->text($value);
        }


        foreach ($infos['mission'] as $lang => $text) {
            $list()->p(['lang' => $lang, 'class' => 'mission'])->text($text);
        }

    }

};
