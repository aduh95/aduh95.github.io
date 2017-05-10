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
        ()->h3()->img(['src'=>CONFIG\MEDIAS\IMG_DIR.'antoineduhamel.jpg', 'alt'=>CONFIG\MY_INFO\PUBLIC_NAME])()
        ()->ul()->attr('class', 'personal_information');

    foreach (JSONSource::parse('personal_information') as $class => $info) {
        $info_list->li()->attr('class', $class)
            ->a()->attr('href', $info['href'])->text($info['text']);
    }
};
