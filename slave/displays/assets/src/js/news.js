require('../../../node_modules/rss-parser/dist/rss-parser.js');
import moment from 'moment';
import ProgressBar from './lib/progress-bar.js';

window.onload = () => {
    RSSParser.parseURL('http://smirrormaster.local:8080/https://spiegel.de/schlagzeilen/tops/index.rss', (err, parsed) => {
        let items = parsed.feed.entries.slice(0, 5);
        let i = 0;

        window.setInterval(function render() {
            let item = items[i];

            let template = `
                <div class="c-news-display__logo"></div>
                <div class="c-news-display__content">
                    <p class="c-news-display__meta">${i + 1} von ${items.length}  •  ${ moment(item.pubDate).lang('de').fromNow() }</p>
                    <h1 class="c-news-display__title">${item.title}</h1>
                    <p class="c-news-display__description">${item.contentSnippet}</p>
                </div>
                <div class="c-news-display__progress-bar">
                    <div class="c-progress-bar"></div>
                </div>`;

            document.querySelector('.c-news-display').innerHTML = template;
            new ProgressBar(document.querySelector('.c-progress-bar'), 20000);

            if(i === items.length - 1) {
                i = 0;
            } else {
                i++;
            }

            return render;

        }(), 20000);
    });
};