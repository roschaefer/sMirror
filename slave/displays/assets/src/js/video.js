// aufruf: http://localhost:8000/video/?vid=begruessung
// liste aller verfuegbaren videos
// entweder zu einem key ist eine src als string zugeordnet -> src setzen
// oder es ist ein array -> dann greift die 'jeden tag ein anderes video' logik

const VIDS = {
    'begruessung': './videos/sample1.mp4',
    'kinder': './videos/sample2.mp4',
    'tutorial': [
        './videos/sample1.mp4',
        './videos/sample1.mp4',
        './videos/sample1.mp4',
        './videos/sample1.mp4',
        './videos/sample1.mp4'
    ]
};

// max number of entries used from the feed
const MAX_ENTRIES = 5;

let entryOfTheDay = (entries) => {
    let d = new Date().getDay();
    return entries[d % MAX_ENTRIES];
};

window.onload = () => {
    let params = (new URL(document.location)).searchParams;
    let vid = params.get("vid");
    let src = '';
    if(Array.isArray(VIDS[vid])){
        src = entryOfTheDay(VIDS[vid])
    }else{
        src = VIDS[vid];
    }


    let template = `
                <video autoplay="autoplay" controls="controls" width="800" height="480" src="${src}"></video>
            `;

    document.querySelector('.c-viewport').innerHTML = template;
};