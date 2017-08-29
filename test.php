<?php

function mysplit($text, $keywords) {
    $ret = [];
    $pointersList = [];
    $strlen = strlen($text);

    foreach ($keywords as $keyword) {
        $offset = 0;
        while (false !== $offset = stripos($text, $keyword, $offset)) {
            $pointersList[$offset++] = $keyword;
        }
    }

    $lastKey = 0;
    for ($i=0; $i < $strlen; $i++) {
        if(isset($pointersList[$i])) {
            $ret[] = substr($text, $lastKey, $i);
            $ret[] = $pointersList[$i];
            $lastKey = $i+=strlen($pointersList[$i]);
        }
    }

    return $ret;
}

const LOREM = <<<'TXT'
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit lectus risus, sed convallis nulla pulvinar vel. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ornare mi eget ipsum condimentum egestas. Maecenas laoreet diam purus, vitae vulputate nibh feugiat sit amet. Sed accumsan odio neque, a varius tellus eleifend in. Sed felis ante, suscipit in metus in, sagittis hendrerit lectus. Morbi tempor libero augue, eget accumsan enim iaculis nec. Etiam dui libero, porttitor a gravida a, suscipit at ipsum. Aenean ac blandit tellus. Donec porta, felis nec venenatis tincidunt, leo nunc sollicitudin dolor, a molestie tortor dui quis enim. Fusce nec eros vel lectus commodo facilisis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Duis a nisl a erat rutrum bibendum et eu est. Sed a tempor augue. Aenean posuere imperdiet magna ut gravida. Donec vitae molestie justo. In blandit nulla erat, vel facilisis nunc elementum id. Nulla tristique facilisis est, eget rutrum mi aliquam sit amet. Curabitur vel ante imperdiet, sagittis nibh et, fringilla mi. Cras sed lacus velit. Vestibulum pretium ac dui a varius. Fusce tincidunt purus enim, in fringilla orci condimentum auctor. Vestibulum cursus magna id risus congue, ut pulvinar eros volutpat.

Nunc tincidunt sem vel nunc hendrerit, non convallis orci mollis. Praesent non massa magna. Praesent at tortor sapien. Quisque facilisis gravida magna, ac varius odio accumsan ut. Sed nec maximus neque, hendrerit blandit tortor. Aliquam mi diam, pellentesque a lobortis ac, mollis vel enim. Nulla sed pellentesque metus.

Curabitur ut maximus nulla, commodo venenatis mauris. Suspendisse sit amet leo nec sem porttitor pulvinar. Vestibulum et vestibulum sem. Nulla commodo vel sapien ac semper. Praesent sed cursus arcu, a aliquet turpis. Etiam sollicitudin lorem velit, at auctor enim suscipit ultricies. Ut ac egestas ligula.

Duis a nisl maximus, pulvinar dolor fermentum, blandit augue. In ex odio, tincidunt eget aliquet vitae, volutpat nec est. Ut et dignissim arcu. Fusce in felis ornare urna bibendum aliquam sodales sed orci. Quisque euismod augue orci, vel imperdiet neque suscipit nec. Duis at iaculis ante. Ut justo arcu, finibus eget nisl nec, tincidunt semper ligula. Fusce et erat eu arcu porttitor dictum sed quis justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi sit amet cursus ante. Duis eget semper dolor, ac feugiat tortor. Duis non tellus facilisis, auctor purus et, rhoncus ante. Quisque sit amet consectetur quam, non posuere nunc. Ut bibendum cursus nisl non lacinia.
TXT;
var_dump(mysplit(LOREM, ['ipsum', 'sed', 'lacinia']));
