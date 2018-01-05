import moment from 'moment';
import Countdown from './lib/countdown.js';
import Clock from './lib/clock.js';

window.onload = () => {

    new Clock(document.querySelector('.c-countdown-display__clock'));

    fetch('api.php').then((response) => {
        return response.json();
    }).then((nextEvent) => {

        document.querySelector('.c-countdown-display__next-event').innerHTML = `
            Zeit bis <strong class="c-countdown-display__event-title">${ nextEvent.summary }</strong> beginnt:
        `;

        let nextEventStart = Date.parse(nextEvent.start);
        new Countdown(document.querySelector('.c-countdown'), nextEventStart);

    });
    
};