require('../../../node_modules/rss-parser/dist/rss-parser.js');

window.onload = () => {
    RSSParser.parseURL('rss.php', (err, parsed) => {
        let items = parsed.feed.entries.slice(0, 5);
        let i = 0;

        window.setInterval(function render() {
            let item = items[i];

            let template = `
                <div class="c-news-display">
                    <h1 class="c-news-display__title">${item.title}</h1>
                    <p class="c-news-display__description">${item.contentSnippet}</p>
                    <p class="c-news-display__count">${i + 1} von ${items.length}</p>
                </div>`;

            document.querySelector('.c-viewport').innerHTML = template;

            if(i === items.length - 1) {
                i = 0;
            } else {
                i++;
            }

            return render;
        }(), 2000);
    });
};