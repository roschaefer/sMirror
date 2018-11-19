<?php

header('Content-Type: application/rss+xml');
header('Access-Control-Allow-Origin: *');
echo file_get_contents('https://www.tagesschau.de/export/video-podcast/tagesschau-in-100-sekunden/');

?>
