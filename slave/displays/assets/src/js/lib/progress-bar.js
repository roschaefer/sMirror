module.exports = (function() {
    var easingFunc = (t) => {
        return (t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t).toFixed(4);
    };

    function ProgressBar(element, duration) {
        if(duration > 0) {
            let t = 0;
            let fps = 60;

            let timer = window.setInterval(() => {
                window.requestAnimationFrame(() => {
                    if(t <= duration) {
                        t += 1000 / fps;
                        element.setAttribute('style', '--progress:' + Math.max(easingFunc(t/duration.toFixed(5)) * 100, 2) + '%');
                    } else {
                        window.clearInterval(timer);
                    }
                });
            }, 1000 / fps);

        }
    }

    return ProgressBar;
})();