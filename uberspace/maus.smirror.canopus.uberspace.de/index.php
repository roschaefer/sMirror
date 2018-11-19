<?php

header('Content-Type: application/rss+xml');
header('Access-Control-Allow-Origin: *');
echo file_get_contents('http://www1.wdr.de/mediathek/video/podcast/channel-sendung-mit-der-maus-100.podcast');

?>
