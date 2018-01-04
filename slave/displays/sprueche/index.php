<?php
require_once('api.php');
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Sprüche</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="../assets/dist/css/main.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
    </head>
    <body>
        <div class="c-viewport">
            <div class="c-sprueche-display">
                <div class="c-sprueche-display__logo"></div>
                <p class="c-sprueche-display__count">Sprüche</p>
                <div class="c-sprueche-display__content">
                    <p class="c-sprueche-display__sprueche">
                        <?= $spruch[2]; ?>
                    </p>
                    <p class="c-sprueche-display__subtitle">
                        - <?= $spruch[1]; ?>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>