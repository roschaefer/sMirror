import moment from 'moment';

window.onload = () => {
    fetch('api.php').then((response) => {
        return response.json();
    }).then((data) => {
        let tweets = data.tweets;
        let i = 0;

        window.setInterval(function render() {
            let tweet = tweets[i];
            let created_at = moment(new Date(tweet.created_at) * 1000).format('DD.MM.YYYY, hh:mm:ss');

            let template = `
                    <div class="c-twitter-display">
                        <div class="c-twitter-display__logo"></div>
                        <p class="c-twitter-display__count">Tweet ${i + 1} von ${tweets.length}</p>
                        <div class="c-twitter-display__content">
                            <h1 class="c-twitter-display__author">von ${tweet.user} <span class="c-twitter-display__date">${created_at}</span></h1>
                            <p class="c-twitter-display__description">${tweet.text}</p>
                            <div class="c-twitter-display__stats">
                                <span class="c-twitter-display__retweets"></span> ${tweet.retweet_count} Retweets
                                <span class="c-twitter-display__favorites"></span> ${tweet.favorite_count} Favorites
                            </div>
                        </div>
                    </div>`;

            document.querySelector('.c-viewport').innerHTML = template;

            if(i === tweets.length - 1) {
                i = 0;
            } else {
                i++;
            }

            return render;
        }(), 20000);
    });
};