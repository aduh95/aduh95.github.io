<?php
/**
 * Generates the easter egg comment in the HTML
 * This view should be added in every page of the website
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

return function ($doc) {
    $aside = $doc()->aside();
    $info_list = $aside->append()
        ()->header()->append()
            ()->h3()->img([
                'src'=>CONFIG\MEDIAS\IMG_DIR.CONFIG\MY_INFO\SELF_PORTRAYAL_FILE,
                'alt'=>CONFIG\MY_INFO\PUBLIC_NAME,
                'width'=>1400,
                'height'=>1600
            ])()
            ()->ul()->attr('class', 'personal_information');
    $about_section = $aside->append()
        ()->section(['class'=>'about'])->append()
            ()->h3(['lang' => 'en'], 'About me')
            ()->h3(['lang' => 'fr'], 'À propos de moi')
            ();
    $skills_list = $aside->append()
        ()->section()->append()
            ()->h3(['lang' => 'en'], 'Skills')
            ()->h3(['lang' => 'fr'], 'Points forts')
            ()->ul()->attr('class', 'skills');
    $hobbies_list = $aside->append()
        ()->section()->append()
            ()->h3(['lang' => 'en'], 'Hobbies')
            ()->h3(['lang' => 'fr'], 'Loisirs')
            ()->ul()->attr('class', 'hobbies');

    foreach (JSONSource::parse('personal_information') as $class => $info) {
        $info_list->li()->attr('class', $class)
            ->i(['class'=>'fa fa-'.$info['icon']])()
            ->a(['href' => $info['href'], 'target' => '_blank', 'rel'=>'noopener'])
                ->text($info['text']);
    }

    foreach (JSONSource::parse('about') as $lang => $text) {
        $about_section->p()->attr('lang', $lang)->text($text);
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
