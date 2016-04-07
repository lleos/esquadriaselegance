<?php
$file = $_GET["file"];
$ext = substr($file,strrpos($file, ".")+1,strlen($file));
ob_start ("ob_gzhandler");
if($ext=="js") $ext="javascript";
header( "Content-type: text/".$ext."; charset: <span class='attribute-value'>utf-8</span>");//não se esqueça de mudar para o charset que você usa
header( "Content-Encoding: gzip,deflate");
header( "Expires: ".gmdate("D, d M Y H:i:s", time() + (24 * 60 * 60)) . " GMT");//adiciona 1 dia ao tempo de expiração
header( "ETag: ");//a idéia é apagar o conteúdo da Etag, ver post http://www.meiocodigo.com/2007/12/21/melhorando-o-tempo-de-carregamento-de-um-site/
header( "Cache-Control: must-revalidate, proxy-revalidate" );
include($file);
ob_flush();
?>