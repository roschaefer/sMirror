<?php
/**
 * Created by PhpStorm.
 * User: Matthias
 * Date: 02.01.2018
 * Time: 20:32
 */
require __DIR__ . '/vendor/autoload.php';

use Carbon\Carbon;
/*use Tracy\Debugger;

Debugger::enable();*/

$calendarId = 'vicari@posteo.de';
$hoursBeforeEvent = 0; // Leave house n hours before event (for countdown)

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

$ersterTermin = null;
if (count($termine) > 0) {
    foreach ($termine as $termin) {
        $date = new Carbon($termin['start']->format(DATE_ISO8601));
        if (!$termin['recurring'] && $date->subHours($hoursBeforeEvent)->gt(Carbon::now())) {
            //dump($date->subHours($hoursBeforeEvent)->gt(Carbon::now()));
            $ersterTermin = $termin;
            $ersterTermin['start'] = $date->format(DATE_ISO8601);
            break;
        }
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
    var_dump($token); die();
}