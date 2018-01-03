<?php
require __DIR__ . '/vendor/autoload.php';

echo 'Test 123';

$client = new Google_Client();
$token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
dump($token);
#saveToken($token);
echo('<script>window.location.replace("'.filter_var($redirect_uri, FILTER_SANITIZE_URL).'");</script>');