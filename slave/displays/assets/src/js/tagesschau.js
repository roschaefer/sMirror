require('../../../node_modules/rss-parser/dist/rss-parser.js');

window.onload = () => {
    // real feed url - uncomment line below
    let url = 'https://tagesschau.smirror.canopus.uberspace.de';
    // local test feed url
    //let url = './local-feed.xml';

    RSSParser.parseURL(url, (err, parsed) => {
        if (err || parsed === undefined) {
            console.error(err);
        } else {
            let template = `
                <video autoplay="autoplay" width="800" height="480" src="${parsed.feed.entries[0].enclosure.url}"></video>
            `;

            document.querySelector('.c-viewport').innerHTML = template;
        }

    });

};
