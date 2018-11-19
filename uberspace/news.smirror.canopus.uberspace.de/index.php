<?php

header('Content-Type: application/rss+xml');
header('Access-Control-Allow-Origin: *');
echo file_get_contents('https://spiegel.de/schlagzeilen/tops/index.rss');

?>
