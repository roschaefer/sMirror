import moment from 'moment';

module.exports = (function() {

    function Clock($element) {
        let self = this;
        this.$element = $element;

        window.setInterval(function updateTime() {
            window.requestAnimationFrame(() => {
                self.updateTime();
            });

            return updateTime;
        }(), 1000);
    }

    Clock.prototype.updateTime = function() {
        let time = moment().format('HH:mm [Uhr]');
        this.$element.innerHTML = time;
    }

    return Clock;

})();