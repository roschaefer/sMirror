<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
$base = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&interval=60min';
$url = $base . '&symbol=' . $_GET['symbol'] . '&apikey=' . $_GET['apikey'];
echo file_get_contents($url);

?>
