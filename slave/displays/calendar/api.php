<?php
/**
 * Created by PhpStorm.
 * User: Matthias
 * Date: 02.01.2018
 * Time: 20:32
 */
require __DIR__ . '/vendor/autoload.php';

use Carbon\Carbon;
use Tracy\Debugger;

Debugger::enable();

$calendarId = 'vicari@posteo.de';
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
$credentials = parse_ini_file('credentials.ini');

$client = new Google_Client();

$client->setApplicationName("My Application");
$client->setAccessType('offline');
$client->setClientId('634308549501-86calu30k28u38u01m0d62c6tn4smtfe.apps.googleusercontent.com');
$client->setClientSecret('pUnR9aiZtSqLQnxFs0V31skj');
$client->setRedirectUri('http://localhost:8080/sMirror/slave/displays/calendar/api.php');
$client->addScope("https://www.googleapis.com/auth/calendar.readonly");

$client->refreshToken($credentials['GOOGLE_CALENDAR_REFRESH_TOKEN']);
$accessToken = $client->getAccessToken();
$service = new Google_Service_Calendar($client);
$optParams = array(

);
#dump($service->calendarList->listCalendarList($optParams));

$today = new DateTime("today");
$optParams = array(
    'maxResults' => 300,
    'timeMin' => $today->format("c"),
    'orderBy' => 'startTime',
    'singleEvents' => true, // Möglicherweise werden wiederkehrende Events nicht angezeigt, ist nötig für Sortierung
);

$events = $service->events->listEvents($calendarId, $optParams);

$termine = [];

$now = Carbon::now();
$endOfDay = Carbon::now()->endOfDay();


foreach ($events->getItems() as $event) {
    $start = new DateTime($event->start->dateTime);
    $end = new DateTime($event->end->dateTime);
    $dauer = date_diff($end, $start);
    $minuten = $dauer->h*60+$dauer->i;
    $summary = $event->getSummary();
    $description = $event->getDescription();
    $startDate = new Carbon($start->format(DATE_ISO8601));
    $location = $event->getLocation();

    if (($endOfDay->gte($startDate) && $now->lte($startDate))
        || $event->getStart()->date == date('Y-m-d')) { // && $now->lte($startDate)
        /*dump($event);
        dump($event->getStart()->date);
        dump($event->getStart()->date == date('Y-m-d'));
        dump(date('Y-m-d'));*/
        $recurring = false;
        if ($event->getStart()->date == date('Y-m-d')) {
            $start = Carbon::now()->startOfDay();
            $recurring = true;
        }

        $termine[] = [
            'start' => $start,
            'end' => $end,
            'dauer' => $dauer,
            'minuten' => $minuten,
            'summary' => $summary,
            'description' => $description,
            'location' => $location,
            'recurring' => $recurring,
        ];
    }
}

// Erst auf https://myaccount.google.com/u/0/permissions die permissions für die App (sMirror) abschalten
// Dann getAccessAndRefreshToken() direkt nach dem einbinden von autoload.php ausführen (einmalig) und Zugriff gewähren
// und Refresh Token in Rückgabe nach credentials.ini speichern
function getAccessAndRefreshToken()
{
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
}