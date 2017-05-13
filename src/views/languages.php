<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

require_once '../vendor/autoload.php';


return function ($doc, $sectionElem) {
    $sectionElem->attr('id', 'languages');

    foreach (JSONSource::parse('languages') as $section) {
        $article = $sectionElem->article();

        foreach ($section['name'] as $lang => $text) {
            $article->h5()->text($text)->attr('lang', $lang);
        }

        $meter = $article->meter(['value'=>$section['level']]);

        foreach ($section['description'] as $lang => $text) {
            $meter->span()->text($text)->attr('lang', $lang);
        }


    }
};
