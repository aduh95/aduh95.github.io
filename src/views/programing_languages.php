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
    $sectionElem->attr('class', 'col-md-6 meter-section');

    $languages = JSONSource::parse('programing_languages');
    usort($languages, function ($pv, $cv) {
        return $cv['level']<=>$pv['level'];
    });


    foreach ($languages as $section) {
        $article = $sectionElem->article();

        $article->h5()->text($section['name']);

        $meter = $article->meter(['value'=>$section['level']]);

        // foreach ($section['description'] as $lang => $text) {
        //     $meter->span()->text($text)->attr('lang', $lang);
        // }


    }
};
