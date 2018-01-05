import greetings from './gutenMorgen/greetings.js';
import selectByDay from './lib/selectByDay.js';

window.onload = () => {
    let name = new URL(document.location).searchParams.get('name');
    document.querySelector('.c-guten-morgen-display__greeting').innerHTML = selectByDay(greetings).replace('${name}', name);
};