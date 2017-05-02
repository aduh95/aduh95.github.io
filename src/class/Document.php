<?php

namespace aduh95\Resume;

use aduh95\HTMLGenerator\Document as ParentDocument;
use RuntimeException;
use const aduh95\Resume\CONFIG\GENERAL\CACHE_DIR;
use const aduh95\Resume\CONFIG\GENERAL\CACHE_PERSISTANT;

/**
* The default Document for the website
 *
* @author Antoine du HAMEL
*/
class Document extends ParentDocument
{
    /**
     * @var string[] VOID_ELEMENTS @see https://bugs.php.net/bug.php?id=73175
     */
    const VOID_ELEMENTS = [
        'command',
        'embed',
        'keygen',
        'source',
        'track',
        'wbr',
    ];

    protected $pageContainer;

    protected $cacheURI;

    public $autoOut = true;

    /**
     * @param string $title The title of the document
     */
    public function __construct($title)
    {
        try {
            $this->loadFromCache();
        } catch (RuntimeException $e) {
            parent::__construct(CONFIG\MY_INFO\PUBLIC_NAME.' | '.$title);

            $this->head->meta(['charset'=>'utf-8']);
            $this->addView('easter_egg');

            $this->head->meta('description', CONFIG\MY_INFO\WEBSITE_DESCRIPTION);
            $this->head->meta('author', CONFIG\MY_INFO\PUBLIC_NAME);

            $this->head->link(['rel'=>'icon', 'type'=>'image/png', 'href'=>format\getHref(CONFIG\MEDIAS\FAVICON)]);
            $this->head->meta('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');

            if (!PROD_ENVIRONMENT) {
                $this->head->style(CONFIG\MEDIAS\VENDOR_CSS_SRC);
                $this->head->style(CONFIG\MEDIAS\CSS_SRC);
                $this->head->script(CONFIG\MEDIAS\VENDOR_JS_SRC);
                $this->head->script(CONFIG\MEDIAS\JS_SRC);
            } else {
                $this->head->style(CONFIG\MEDIAS\UGLY_CSS_SRC);
                $this->head->script(CONFIG\MEDIAS\UGLY_JS_SRC);
            }
        }
    }

    public function loadFromCache()
    {
        if (!is_dir(CACHE_DIR)) {
            mkdir(CACHE_DIR, 0750);
        }

        $callingFile = (new RuntimeException)->getTrace();
        $this->cacheURI = CACHE_DIR . DIRECTORY_SEPARATOR . strtr(base64_encode(array_pop($callingFile)['file']), '=/+', '-_,');

        if (is_readable($this->cacheURI)) {
            exit;
        } else {
            throw new RuntimeException('This document is not cached yet');
        }
    }

    public function __destruct()
    {
        if (!is_readable($this->cacheURI)) {
            if (PROD_ENVIRONMENT) {
                $this->getBody()->script()->append($this->dom->createCDATASection(CONFIG\MAIL_CHIMP\GOOGLE_ANALYTICS));
            }

            $this->easyLoading();

            if ($this->autoOut) {
                $cacheFile = fopen($this->cacheURI, 'w');
                fwrite($cacheFile, gzencode($this->saveHTML()));
                fclose($cacheFile);
            }
        }

        $headers = apache_request_headers();

        $Etag = $headers['If-None-Match'] ?? null;
        $sha1 = sha1_file($this->cacheURI);

        if ($Etag === $sha1) {
            header('HTTP/1.0 304 Not Modified');
        } else {
            header('ETag: '.$sha1);

            if (PROD_ENVIRONMENT && preg_match('#gzip#', $headers['Accept-Encoding'])) {
                header('Content-Encoding: gzip');
                readfile($this->cacheURI);
            } else {
                echo gzdecode(file_get_contents($this->cacheURI));
            }
        }

        if (!CACHE_PERSISTANT) {
            // No cache on dev mode
            unlink($this->cacheURI);
        }

    }

    public function easyLoading()
    {
        // $list = $this->pageContainer->getElementsByTagName('img');
        //
        // for ($i = $list->length - 1; $i >= 0; --$i) {
        //     $list->item($i)->parentNode->insertBefore($this->createElement('noscript')->attr('class', 'image'), $list->item($i))->appendChild($list->item($i));
        // }
    }

    public function saveHTML()
    {
        return str_replace(
            array_map(
                function ($elem) {
                    return "</$elem>";
                },
                self::VOID_ELEMENTS
            ),
            '',
            strval($this)
        );
    }

    /**
     * Calls a VIEWS
     *
     * @return mixed Depends on the VIEWS
     */
    public function addView($name, ...$args)
    {
        return call_user_func(include CONFIG\GENERAL\VIEWS_DIR . DIRECTORY_SEPARATOR . $name . '.php', $this, ...$args);
    }

    /**
     * Adds an OpenGraph markup
     *
     * @param string $property The property name
     * @param string $value The value of the property
     *
     * @return aduh95\HTMLGenerator\HTMLElement The meta tag generated
     */
    public function addOGProperty($property, $value)
    {
        return $this->getHead()->meta(['property'=>'og:'.$property, 'content'=>$value]);
    }
}
