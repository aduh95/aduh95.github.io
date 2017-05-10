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
        ()->p(['lang'=>'en'], 'IT Student')
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
$sections = [
    'experience' => [
        'en' => 'Experience',
        'fr' => 'Expérience',
    ],
    'education' => [
        'en' => 'Education',
        'fr' => 'Éducation',
    ],
    'languages' => [
        'en' => 'Languages',
        'fr' => 'Langues',
    ],
    'programing_languages' => [
        'en' => 'Programing Languages',
        'fr' => 'Programation informatique',
    ],
];

foreach ($sections as $view_name => $section_name) {
    $section = $main->section();

    foreach ($section_name as $lang => $value) {
        $section->h3()->attr('lang', $lang)->text($value);
    }
    $doc->addView(
        $view_name,
        $section
    );
}

$doc->addView('aside');
