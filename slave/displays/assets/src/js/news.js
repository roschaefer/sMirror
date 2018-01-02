require('../../../node_modules/rss-parser/dist/rss-parser.js');
import moment from 'moment';

window.onload = () => {
    RSSParser.parseURL('rss.php', (err, parsed) => {
        let items = parsed.feed.entries.slice(0, 5);
        let i = 0;

        window.setInterval(function render() {
            let item = items[i];

            let template = `
                <div class="c-news-display">
                    <div class="c-news-display__logo"></div>
                    <div class="c-news-display__content">
                        <p class="c-news-display__meta">${i + 1} von ${items.length}  •  ${ moment(item.pubDate).lang('de').fromNow() }</p>
                        <h1 class="c-news-display__title">${item.title}</h1>
                        <p class="c-news-display__description">${item.contentSnippet}</p>
                    </div>
                </div>`;

            document.querySelector('.c-viewport').innerHTML = template;

            if(i === items.length - 1) {
                i = 0;
            } else {
                i++;
            }

            return render;
        }(), 20000);
    });
};