require('../../../node_modules/rss-parser/dist/rss-parser.js');

window.onload = () => {
    // real feed url - uncomment line below
    let url = 'https://www.tagesschau.de/export/video-podcast/tagesschau-in-100-sekunden/';
    // local test feed url
    //let url = './local-feed.xml';

	  //https://github.com/bobby-brennan/rss-parser#web
	  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
    RSSParser.parseURL(CORS_PROXY + url, (err, parsed) => {
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
