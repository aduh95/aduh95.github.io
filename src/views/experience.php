<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

use const aduh95\Resume\CONFIG\EXPERIENCE\ICONS;
use const aduh95\Resume\CONFIG\EXPERIENCE\DATE_FORMAT;


return function ($doc, $section) {
    foreach (JSONSource::parse('experience') as $name => $infos) {
        $article = $section->article();
        $article->h5()->text($name);

        foreach ($infos['mission'] as $lang => $text) {
            $article->h6(['lang' => $lang, 'class' => 'mission'])->text($text);
        }

        $list = $article->ul();

        if (empty($infos['info'])) $infos['info'] = array();

        foreach ($infos['info'] as $key => $value) {
            $li = $list[] = $doc->createElement('li')
                ->attr('class', 'fa fa-'.ICONS[$key]);

            switch ($key) {
                case 'date':
                    $begin = date_create($value['begin']);
                    $hasEnded = !empty($value['end']);
                    $end = $hasEnded ? date_create($value['end']) : null;
                    if (!$hasEnded || $begin->diff($end)->m) {
                        $span = $li->span(['lang'=>'en']);
                        $span->text($hasEnded ? 'From ' : 'Since ')
                            ->time(['datetime'=>$begin->format(DATE_FORMAT)])
                                ->text($begin->format('F Y'));
                        if ($hasEnded) {
                            $span->text(' to ')
                                ->time(['datetime'=>$end->format(DATE_FORMAT)])
                                    ->text($end->format('F Y'));
                        }
                        $span = $li->span(['lang'=>'fr']);
                        // Using a span to avoid capatalization of the month name
                        $span->span($hasEnded ? 'De ' : 'Depuis ')()
                            ->time(['datetime'=>$begin->format(DATE_FORMAT)])
                                ->text($begin->format('m/Y'));
                        if ($hasEnded) {
                            $span->text(' à ')
                                ->time(['datetime'=>$end->format(DATE_FORMAT)])
                                    ->text($end->format('m/Y'));
                        }
                    } else {
                        // If the current experience did not last more than a mounth
                        $li->span(['lang'=>'en'])
                            ->time(['datetime'=>$begin->format('Y-m')])
                                ->text($begin->format('F Y'));
                        $li->span(['lang'=>'fr'])
                            ->time(['datetime'=>$begin->format('Y-m')])
                                ->text($end->format('m/Y'));
                    }
                    break;

                case 'website':
                    $value = [
                        'link' => $value,
                        'text' => preg_replace('#^https?://(www\.)?#', '', $value)
                    ];
                case 'place':
                    $li->a()
                        ->attr('href', $value['link'])
                        ->attr('target', '_blank')
                        ->attr('rel', 'noopener')
                        ->text($value['text']);
                    break;
            }
        }

        if (!empty($infos['description'])) {
            $details = $article->details();
            $details->summary()->append()
                ()->span(['lang'=>'en'], 'More information')
                ()->span(['lang'=>'fr'], 'En savoir plus');
            foreach ($infos['description'] as $lang => $text) {
                $details->p(['lang' => $lang, 'class' => 'mission'])->text($text);
            }
        }

        if (!empty($infos['technologies'])) {
            $list = $article->ul();

            foreach ($infos['technologies'] as $techno) {
                $list[] = $doc->createElement('li')->attr('class', 'fa fa-'.$techno['icon'])->text($techno['name']);
            }
        }


    }

};
