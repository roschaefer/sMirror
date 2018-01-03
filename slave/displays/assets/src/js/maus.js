require('../../../node_modules/rss-parser/dist/rss-parser.js');

// max number of entries used from the feed
const MAX_ENTRIES = 5;

let entryOfTheDay = (entries) => {
  let d = new Date().getDay();
  return entries[d % MAX_ENTRIES];
};

window.onload = () => {
    // real feed url - uncomment line below
    let url = 'http://www1.wdr.de/mediathek/video/podcast/channel-sendung-mit-der-maus-100.podcast';
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

            let template = `
                <video autoplay="autoplay" controls="controls" width="800" height="480" src="${entryOfTheDay(filtered).enclosure.url}"></video>
            `;

            document.querySelector('.c-viewport').innerHTML = template;
        }

    });

};