import moment from 'moment';
import Countdown from './lib/countdown.js';

window.onload = () => {

    fetch('api.php').then((response) => {
        return response.json();
    }).then((nextEvent) => {

        document.querySelector('.c-countdown-display__title').innerHTML = `Zeit bis »${nextEvent.summary}« beginnt:`;

        let nextEventStart = Date.parse(nextEvent.start);
        new Countdown(document.querySelector('.c-countdown'), nextEventStart);

    });
    
};