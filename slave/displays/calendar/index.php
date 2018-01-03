<?php
    require_once('api.php');#
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Kalender</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="../assets/dist/css/main.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
    </head>
    <body>
        <div class="c-viewport">
            <div class="c-calendar-display">
                <div class="c-calendar-display__logo"></div>
                <p class="c-calendar-display__count">Heutige Termine</p>
                <div class="c-calendar-display__content">
                    <?php if (count($termine) == 0) : ?>
                        <p class="c-calendar-display__description">Keine Termine vorhanden</p>
                    <?php else: ?>
                        <?php foreach (array_slice($termine, 0, 3) as $termin) : ?>
                            <div class="c-calendar-display__event">
                                <p class="c-calendar-display__date-start"><?= $termin['start']->format('d.m.Y H:i:s') ?>
                                    <span class="c-calendar-display__date-spacing">-</span>
                                    <span class="c-calendar-display__date-end"><?= $termin['end']->format('d.m.Y H:i:s') ?> </span>
                                </p>
                                <p class="c-calendar-display__description"><?= $termin['summary'] ?></p>
                                <p class="c-calendar-display__location">
                                    <span class="c-calendar-display__location-icon"></span>
                                    <?= $termine[0]['location'] ?>
                                </p>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <!--<script src="../assets/dist/js/calendar.js"></script>-->
    </body>
</html>