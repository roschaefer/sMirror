require('../../../node_modules/rss-parser/dist/rss-parser.js');

window.onload = () => {
    // TODO change url to real feed url - uncomment line below
    //let url = 'https://www.tagesschau.de/export/video-podcast/tagesschau-in-100-sekunden/';
    let url = './local-feed.xml';

    RSSParser.parseURL(url, (err, parsed) => {
        if(err){
            console.error(err);
        }
        let template = `
            <video autoplay="autoplay" controls="controls" width="800" height="480" src="${parsed.feed.entries[0].enclosure.url}"></video>
        `;

        document.querySelector('.c-viewport').innerHTML = template;
    });

};