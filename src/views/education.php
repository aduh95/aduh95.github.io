<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;


return function ($doc, $sectionElem) {
    foreach (JSONSource::parse('education') as $section) {
        $article = $sectionElem->article();

        foreach ($section['name'] as $lang => $text) {
            $article->h5()->text($text)->attr('lang', $lang);
        }

        $article->ul()->append()
                ()->li()->attr('class', 'date')->text($section['date'] ?? $section['begin'] . ' - ' . $section['end'])
                ()->li()->attr('class', 'place')->text($section['place'])
            ();

        if (!empty($section['description'])) {
            // foreach ($section['description'] as $lang => $text) {
            // $article->p()->text($text)->attr('lang', $lang);
            // }
        }


    }
};
