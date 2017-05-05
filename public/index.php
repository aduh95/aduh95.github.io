<?php
/**
 * Generates HTML for the home page
 *
 * @author Antoine du HAMEL
 */

namespace aduh95\Resume;

require_once '../vendor/autoload.php';

$doc = new Document('Résumé');



$doc()->header()->append()
        ()->h1(CONFIG\MY_INFO\PUBLIC_NAME)
        ()->p('IT Student')
        ()->p(['lang'=>'fr'])->text('Étudiant en informatique')
        ();

$main = $doc()->main();

$sections = <<<'JSON'
{
    "Experience": {
        "Bonjour Paris":{
            "date":"July 2016 to November 2016",
            "place": "Paris, France",
            "website": "https://www.bonjour.agency",
            "mission": "Lorem ipsum dolor sit amet"
        },
        "SEIO": {
            "date":"June 2015 to May 2017",
            "place": "Angers, France",
            "website": "https://www.seio.org",
            "mission": ""
        },
        "Crédit Agricole": {
            "date":"July 2015",
            "place": "Saintes, France",
            "website": "https://www.ca-cmds.fr",
            "mission": ""
        },
        "Journées Paysannes": {
            "date":"August 2013 to December 2015",
            "place": "Angers, France",
            "website": "http://www.journees-paysannes.fr",
            "mission": ""
        }
    },
    "Education": {
        "Groupe ESEO - Engineering school": {
            "begin": 2015,
            "end": "present",
            "description": ""
        },
        "Groupe ESEO - Intensive program preparing for engineering school": {
            "begin": 2013,
            "end": 2015,
            "description": ""
        },
        "French baccalauréat": {
            "date": 2013,
            "description": "Mention Bien"
        }
    },
    "languages": {
        "English": "Quite fluent (TOEIC score 930)",
        "French": "Native speaker",
        "German": "Working knowledge (Goethe-Zertifikat B1)"
    },
    "Programing languages": {
        "PHP": "ss",
        "JavaScript": "",
        "Java": "",
        "SQL": "",
        "C": "",
        "Python": "",
        "HTML/CSS": "",
        "Matlab": ""
    }
}
JSON;
$sections = json_decode($sections, true);

foreach ($sections as $section_name => $info) {
    $section = $main->section()->append()
        ()->h3()->text($section_name)
        ();

    foreach ($info as $name => $infos) {
        $list = $section->article()->append()
        ()->h5()->text($name)
        ()->ul();
        if (is_array($infos)) {
            foreach ($infos as $key => $value) {
                $list[] = $doc->createElement('li')->attr('class', $key)->text($value);
            }
        } else {
            $list->append($infos);
        }

    }
}

$doc()->aside()->append()
    ()->h3()->img(['src'=>CONFIG\MEDIAS\IMG_DIR.'antoineduhamel.jpg', 'alt'=>CONFIG\MY_INFO\PUBLIC_NAME])()
    ()->p()->text('Lorem ipsum')
    ()
();
