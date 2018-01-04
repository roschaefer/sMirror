import moment from 'moment';

window.onload = () => {
    let i = 0;
    var countDownDate = new Date("Jan 4, 2018 12:37:25").getTime();

    let firstNow = new Date().getTime();
    let firstDistance = countDownDate - firstNow;

        window.setInterval(function render() {
            //let created_at = moment(new Date(tweet.created_at) * 1000).format('DD.MM.YYYY, hh:mm:ss');
            // Get todays date and time
            let now = new Date().getTime();

            // Find the distance between now an the count down date
            let distance = countDownDate - now;
            var progressBar = document.getElementById("c-countdown-display__bar");

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);


            if (progressBar !== null) {
                console.log('test');
                console.log(progressBar.style);
                //progressBar.style.cssText = 'width: 200px;';
                progressBar.setAttribute('style', 'width: 30%;');
                // (100 - (distance / firstDistance * 100))
            }
            //console.log(progressBar.style.width); //= width + '%'


            let template = `
                        <div class="c-countdown-display">
                            <div class="c-countdown-display__logo"></div>
                            <p class="c-countdown-display__count">Countdown</p>
                            <div class="c-countdown-display__content">
                                <h1 class="c-countdown-display__subtitle">Zeit bis zum Verlassen des Hauses</h1>
                                <p class="c-countdown-display__countdown">
                                    ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}
                                </p>
                                <div id="c-countdown-display__progress">
                                  <div id="c-countdown-display__bar"></div>
                                </div>
                            </div>
                        </div>`;

            document.querySelector('.c-viewport').innerHTML = template;

        return render;
    }(), 10000);
};