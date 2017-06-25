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
        $article = $section->article();
        $article->h5()->text($name);

        foreach ($infos['mission'] as $lang => $text) {
            $article->h6(['lang' => $lang, 'class' => 'mission'])->text($text);
        }

        $list = $article->ul();

        foreach ($infos['info'] as $key => $value) {
            $list[] = $doc->createElement('li')->attr('class', $key)->text($value);
        }


        foreach ($infos['description'] as $lang => $text) {
            $article->p(['lang' => $lang, 'class' => 'mission'])->text($text);
        }


    }

};
