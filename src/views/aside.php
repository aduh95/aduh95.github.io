<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

require_once '../vendor/autoload.php';


return function ($doc) {
    $info_list = $doc()->aside()->append()
        ()->header()->append()
            ()->h3()->img(['src'=>CONFIG\MEDIAS\IMG_DIR.'antoineduhamel.jpg', 'alt'=>CONFIG\MY_INFO\PUBLIC_NAME])()
            ()->ul()->attr('class', 'personal_information');
    $skills_list = $info_list
            ()
        ()->section()->append()
            ()->h3(['lang' => 'en'], 'Skills')
            ()->h3(['lang' => 'fr'], 'Points forts')
            ()->ul()->attr('class', 'hobbies');
    $hobbies_list = $skills_list
            ()
        ()->section()->append()
            ()->h3(['lang' => 'en'], 'Hobbies')
            ()->h3(['lang' => 'fr'], 'Loisirs')
            ()->ul()->attr('class', 'hobbies');

    foreach (JSONSource::parse('personal_information') as $class => $info) {
        $info_list->li()->attr('class', $class)
            ->a()->attr('href', $info['href'])->text($info['text']);
    }

    foreach (JSONSource::parse('skills') as $skill) {
        $item = $skills_list->li()->append()
            ()->i(['class'=>'fa fa-'.$skill['icon']])
            ();
        foreach ($skill['name'] as $lang => $name) {
            $item->span()->attr('lang', $lang)->text($name);
        }
    }

    foreach (JSONSource::parse('hobbies') as $hobby) {
        $item = $hobbies_list->li()->append()
            ()->i(['class'=>'fa fa-'.$hobby['icon']])
            ();
        foreach ($hobby['name'] as $lang => $name) {
            $item->span()->attr('lang', $lang)->text($name);
        }
    }
};
