<?php
/**
 * Created by PhpStorm.
 * User: Matthias
 * Date: 02.01.2018
 * Time: 20:32
 */
require __DIR__ . '/vendor/autoload.php';

use Tracy\Debugger;

Debugger::enable();

$credentials = parse_ini_file('credentials.ini');

$url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
$getfield = '?count=5';
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange(array(
        'oauth_access_token' => $credentials['TWITTER_ACCESS_TOKEN'],
        'oauth_access_token_secret' => $credentials['TWITTER_ACCESS_TOKEN_SECRET'],
        'consumer_key' => $credentials['TWITTER_CONSUMER_KEY'],
        'consumer_secret' => $credentials['TWITTER_CONSUMER_SECRET']
    )
);

$response = $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

$response = json_decode($response);
dump($response); die();
$tweets = [];

foreach ($response as $tweet) {
    /*dump($tweet);
    dump($tweet->text);
    dump($tweet->created_at);
    dump($tweet->user->name);
    dump($tweet->retweet_count);
    dump($tweet->favorite_count);*/
    $tweets[] = [
        'text' => $tweet->text,
        'created_at' => $tweet->created_at,
        'user' => $tweet->user->name,
        'retweet_count' => $tweet->retweet_count,
        'favorite_count' => $tweet->favorite_count,
    ];
}

die(json_encode(['tweets' => $tweets]));
