// aufruf: http://localhost:8000/video/?vid=begruessung
// liste aller verfuegbaren videos
// entweder zu einem key ist eine src als string zugeordnet -> src setzen
// oder es ist ein array -> dann greift die 'jeden tag ein anderes video' logik
import VIDS from './video/videos.js';
import selectByDay from './lib/selectByDay.js';

window.onload = () => {
    let params = new URL(document.location).searchParams;
    let vid = params.get('kategorie');
    let src = '';

    if(Array.isArray(VIDS[vid])) {
        src = selectByDay(VIDS[vid]);
    } else {
        src = VIDS[vid];
    }

    let template = `<video autoplay width="800" height="480" src="videos/${src}"></video>`;
    document.querySelector('.c-viewport').innerHTML = template;
};