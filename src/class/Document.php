<?php

namespace aduh95\Resume;

use aduh95\HTMLGenerator\Document as ParentDocument;
use RuntimeException;
use DOMComment;
use const aduh95\Resume\CONFIG\GENERAL\SRC_DIR;

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

    protected $outputOneFile = false;

    public $autoOut = true;

    /**
     * @param string $title The title of the document
     * @param bool $outputOneFile Flag to embed scripts and style into the generated HTML
     */
    public function __construct($title, $outputOneFile = false)
    {
        parent::__construct(CONFIG\MY_INFO\PUBLIC_NAME.' | '.$title);

        $this->head->meta(['charset'=>'utf-8']);
        $this->addView('easter_egg', $outputOneFile);

        $this->head->meta('description', CONFIG\MY_INFO\WEBSITE_DESCRIPTION);
        $this->head->meta('author', CONFIG\MY_INFO\PUBLIC_NAME);
        $this->head->meta('theme-color', CONFIG\MY_INFO\THEME_COLOR);
        $this->head->link(['rel'=>'manifest', 'href'=>'/manifest.json']);
        $this->head->link(['rel'=>'canonical', 'href'=>CONFIG\MY_INFO\CANONICAL_URL]);

        $this->head->link([
            'rel'=>'icon',
            'type'=>'image/png',
            'href'=>$outputOneFile ?
                'data:img/png;base64,'.base64_encode(file_get_contents(
                    SRC_DIR . DIRECTORY_SEPARATOR .CONFIG\MEDIAS\FAVICON
                )) :
                format\getHref(CONFIG\MEDIAS\FAVICON)
        ]);
        $this->head->meta('viewport', 'width=device-width, initial-scale=1');

        if (!PROD_ENVIRONMENT) {
            $this->outputOneFile = $outputOneFile;
            if ($this->outputOneFile) {
                $this->head->append(
                    new DOMComment('style:'.SRC_DIR . DIRECTORY_SEPARATOR . CONFIG\MEDIAS\UGLY_CSS_SRC)
                );
            } else {
                $this->head->style(CONFIG\MEDIAS\CSS_SRC);
                $this->head->appendChild($this->createElement('script'))
                    ->append(
                        $this->dom->createCDATASection(CONFIG\MEDIAS\JS_MODULE_LOADER)
                    );
                $this->head->script(CONFIG\MEDIAS\JS_SRC);
            }
        } else {
            $this->head->style(CONFIG\MEDIAS\UGLY_CSS_SRC);
            $this->head->script(CONFIG\MEDIAS\UGLY_JS_SRC);
        }
    }

    public function __destruct()
    {
        if (PROD_ENVIRONMENT) {
            $this->getBody()->script()->append(
                $this->dom->createCDATASection(CONFIG\MAIL_CHIMP\GOOGLE_ANALYTICS)
            );
        } elseif ($this->outputOneFile) {
            // Inlining JPEG image(s)
            $list = $this->getBody()->getElementsByTagName('img');
            for ($i = $list->length - 1; $i >= 0; --$i) {
                $list->item($i)->setAttribute(
                    'src',
                    substr($list->item($i)->getAttribute('src'), strlen(CONFIG\MEDIAS\IMG_DIR) - 1)
                );
                $this->head->link([
                    'rel'=>'preload',
                    'as'=>'image',
                    'href'=>$list->item($i)->getAttribute('src')
                ]);
            }

            // Inlining minified JS
            $this->getBody()->script()->append(
                $this->dom->createCDATASection(
                    CONFIG\MEDIAS\JS_MODULE_LOADER.';'.
                    file_get_contents(SRC_DIR . DIRECTORY_SEPARATOR .CONFIG\MEDIAS\UGLY_JS_SRC)
                )
            );
        }

        if ($this->autoOut) {
            print $this->saveHTML();
        }
    }

    /**
     * Patch the PHP invalid HTML bug on some HTML5 elements
     * @see https://bugs.php.net/bug.php?id=73175
     * @return string
     */
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
