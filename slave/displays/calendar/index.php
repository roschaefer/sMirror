<?php
require __DIR__ . '/vendor/autoload.php';

$authConfigFile= __DIR__ . '/client_secret.json';
$redirect_uri = 'http://localhost:8080/sMirror/slave/displays/calendar/index.php';
$client = new Google_Client();
$client->setAuthConfigFile($authConfigFile);
$client->addScope("https://www.googleapis.com/auth/calendar");
$client->setAccessType("offline");
$client->setRedirectUri($redirect_uri);
if (!$_GET['code']) {
    $auth_url = $client->createAuthUrl();
    echo('<script>window.location.replace("' . filter_var($auth_url, FILTER_SANITIZE_URL) . '");</script>');
}

$token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
dump($token); die();
echo('<script>window.location.replace("'.filter_var($redirect_uri, FILTER_SANITIZE_URL).'");</script>');
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Twitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="../assets/dist/css/main.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
    </head>
    <body>
        <div class="c-viewport"></div>
        <script src="../assets/dist/js/twitter.js"></script>
    </body>
</html>