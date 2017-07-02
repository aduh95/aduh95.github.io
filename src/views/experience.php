<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

use const aduh95\Resume\CONFIG\EXPERIENCE\ICONS;

require_once '../vendor/autoload.php';


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
                    $end = date_create($value['end']);
                    if ($begin->diff($end)->m) {
                        $li->span(['lang'=>'en'])->append()
                            ()->text('From ')->time(['datetime'=>$value['begin']])
                                ->text($begin->format('F Y'))
                            ()->text(' to ')->time(['datetime'=>$value['end']])
                                ->text($end->format('F Y'));
                        $li->span(['lang'=>'fr'])->append()
                            ()->text('De ')->time(['datetime'=>$value['begin']])
                                ->text($begin->format('m/Y'))
                            ()->text(' à ')->time(['datetime'=>$value['end']])
                                ->text($end->format('m/Y'));
                    } else {
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
                    $li->a()->attr('href', $value['link'])->text($value['text']);
                    break;
            }
        }


        foreach ($infos['description'] as $lang => $text) {
            $article->p(['lang' => $lang, 'class' => 'mission'])->text($text);
        }

        if (!empty($infos['technologies'])) {
            $list = $article->ul();

            foreach ($infos['technologies'] as $techno) {
                $list[] = $doc->createElement('li')->attr('class', 'fa fa-'.$techno['icon'])->text($techno['name']);
            }
        }


    }

};
