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
        ()
    ()->main()->text('test')
    ()
();
