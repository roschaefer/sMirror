<?php
/**
 * Created by PhpStorm.
 * User: Matthias
 * Date: 02.01.2018
 * Time: 20:32
 */
require __DIR__ . '/vendor/autoload.php';
/*
$info = array
(
    'refresh_token' => 'ya29.Gls3BUTEkOiVf7CupitLCOD1-hJgvRI2p1DP3Fe43aueYiW4jh_UQe3RThev8Wp9mMScHM_obM-94nVH3qLHY81DGHmRTlPrgeXizCG7K5PRMD_GjRgLtLTSXwfh',
    'grant_type' => 'refresh_token',
    'client_id' => '634308549501-86calu30k28u38u01m0d62c6tn4smtfe.apps.googleusercontent.com',
    'client_secret' => 'pUnR9aiZtSqLQnxFs0V31skj'
);

// Get returned CURL request
$request = $this->make_request('https://accounts.google.com/o/oauth2/token', 'POST', 'normal', $info);

// Push the new token into the api_config
#$this->api_config['access_token'] = $request->access_token;

// Return the token
dump($request->access_token);
*/

$refreshToken = 'ya29.Gls3BUTEkOiVf7CupitLCOD1-hJgvRI2p1DP3Fe43aueYiW4jh_UQe3RThev8Wp9mMScHM_obM-94nVH3qLHY81DGHmRTlPrgeXizCG7K5PRMD_GjRgLtLTSXwfh';

$client = new Google_Client();

$client->setApplicationName("My Application");
$client->setAccessType('offline');
$client->setClientId('634308549501-86calu30k28u38u01m0d62c6tn4smtfe.apps.googleusercontent.com');
$client->setClientSecret('pUnR9aiZtSqLQnxFs0V31skj');
$client->setRedirectUri('http://localhost:8080/sMirror/slave/displays/calendar/api.php');
$client->addScope("https://www.googleapis.com/auth/calendar.readonly");

$client->refreshToken($refreshToken);
$accessToken = $client->getAccessToken();

$service = new Google_Service_Calendar($client);
$optParams = array(

);
#dump($service->calendarList->listCalendarList($optParams));

$today = new DateTime("today");
$optParams = array(
    'maxResults' => 300,
    'timeMin' => $today->format("c"),
);

$events = $service->events->listEvents('vicari@posteo.de', $optParams);

foreach ($events->getItems() as $event) {
    $start = new DateTime($event->start->dateTime);
    $end = new DateTime($event->end->dateTime);
    $dauer = date_diff($end, $start);
    $minuten = $dauer->h*60+$dauer->i;
    $summary = $event->getSummary();
    $description = $event->getDescription();
    dump($start);
    dump($end);
    dump($dauer);
    dump($minuten);
    dump($summary);
    dump($description);
}