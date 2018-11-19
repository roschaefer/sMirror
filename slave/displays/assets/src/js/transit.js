import moment from 'moment';
import keys from './config/keys.js';

const ORIGIN = 'Hinter dem Brunnen 6, Lüneburg';
const DESTINATION = 'Hongkongstr. 1, Hamburg';

let key = keys.transit;
let base = 'https://maps.googleapis.com/maps/api/directions/json';
let url = `${base}?origin=${ORIGIN}&destination=${DESTINATION}&mode=transit&alternatives=true&key=${key}`;

    fetch(url, {
        method: 'get',
        mode: 'cors',
    }).then((response) => {
        return response.json();
    }).then((data) => {

        // normalize data
        let routes = data.routes.map((route) => {
            let leg = route.legs[0];

            let data = {
                steps: leg.steps
                    .filter((step) => {
                        return step.travel_mode === 'TRANSIT';
                    })
                    .map((step) => {
                        let details = step.transit_details;
                        return {
                            departure: {
                                time: new Date(details.departure_time.value * 1000),
                                stop: details.departure_stop.name,
                            },
                            arrival: {
                                time: new Date(details.arrival_time.value * 1000),
                                stop: details.arrival_stop.name,
                            },
                            name: details.line.short_name,
                            type: details.line.vehicle.name,
                        };
                    }),
            };

            data.departure = data.steps[0].departure;
            data.arrival = data.steps[data.steps.length - 1].arrival;

            return data;
        });

        // render routes
        let partials = routes.map((route, index) => {
            return `
                <div class="c-route ${index === 0 ? 'c-route--primary' : ''}">
                    <div class="c-route__time">
                        ${ index === 0 ? `<span data-relative-date="${moment(route.departure.time).toISOString()}"></span>  • ` : ''}
                        Ab ${ moment(route.departure.time).format('HH:mm') }
                        bis ${ moment(route.arrival.time).lang('de').format('HH:mm') } Uhr
                    </div>
                    <div class="c-route__steps">
                        <span class="c-route__step">${route.departure.stop}</span>

                        ${route.steps.map(step =>`
                            <span class="c-route__step">${step.name}</span>
                        `).join('')}

                        <span class="c-route__step">${route.arrival.stop}</span>
                    </div>
                </div>`;
        });

        let $container = document.querySelector('.c-transit-display');

        $container.innerHTML = `<div class="c-transit-display__primary-route">${partials[0]}</div>`;
        $container.innerHTML += `<div class="c-transit-display__alternatives">${partials.slice(1, partials.length - 1).join('')}</div>`;

        window.setInterval(function updateTime() {
            document.querySelectorAll('[data-relative-date]').forEach((element) => {
                element.innerHTML = moment(element.dataset.relativeDate).lang('de').fromNow();
            });
            return updateTime;
        }(), 1000);

    });
