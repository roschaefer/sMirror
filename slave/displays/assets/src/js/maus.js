require('../../../node_modules/rss-parser/dist/rss-parser.js');
import selectByDay from './lib/selectByDay.js';

// max number of entries used from the feed
const MAX_ENTRIES = 5;

window.onload = () => {
    // real feed url - uncomment line below
    let url = 'http://localhost:8080/http://www1.wdr.de/mediathek/video/podcast/channel-sendung-mit-der-maus-100.podcast';
    // local test feed url
    //let url = './local-feed.xml';

    RSSParser.parseURL(url, (err, parsed) => {
        if (err || parsed === undefined) {
            console.error(err);
        } else {
            let items = parsed.feed.entries;

            // remove duplicates with sign language
            let filtered = items.filter((itm) => {
                return itm.title.indexOf('Gebärdensprache') === -1;
            });

            let url = selectByDay(filtered).enclosure.url

            let template = `<video autoplay width="800" height="480" src="${url}"></video>`;

            document.querySelector('.c-viewport').innerHTML = template;
        }

    });

};