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
            let timeLeft = self.end - Date.now();
            $timer.innerHTML = moment.utc(timeLeft).format('HH:mm:ss');

            return updateTime;
        }(), 1000);

        console.log($timer);
    }

    return Countdown;
})();