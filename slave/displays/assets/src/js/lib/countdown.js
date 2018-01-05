import ProgressBar from './progress-bar.js';
import moment from 'moment';

module.exports = (function() {
    function Countdown($element, end) {
        this.$element = $element;
        this.start = Date.now();
        this.end = end;

        this.initTimer();
        this.initProgressBar();
    }

    Countdown.prototype.initProgressBar = function() {
        let duration = this.end - this.start;

        let $progressBar = document.createElement('div');
        $progressBar.classList.add('c-progress-bar', 'c-progress-bar--large', 'c-progress-bar--fancy');
        new ProgressBar($progressBar, duration);

        let $container = document.createElement('div');
        $container.classList.add('c-countdown__progress-bar');

        $container.appendChild($progressBar);
        this.$element.appendChild($container);
    };

    Countdown.prototype.initTimer = function() {
        let self = this;
        let $timer = document.createElement('div');
        $timer.classList.add('c-countdown__timer');

        self.$element.appendChild($timer);

        window.setInterval(function updateTime() {
            let timeLeft = 0;
            let sign = '';

            if(self.end - Date.now() >= 0) {
                timeLeft = self.end - Date.now();
                sign = '';
            } else {
                timeLeft = Date.now() - self.end;
                sign = '-';
            }

            if(timeLeft <= 3 * 60 * 1000 || sign === '-') self.$element.classList.add('c-countdown--critical');

            if(timeLeft >= 0) {
                $timer.innerHTML = sign + moment.utc(timeLeft).format('HH:mm:ss');
            }

            return updateTime;
        }(), 1000);

        console.log($timer);
    }

    return Countdown;
})();