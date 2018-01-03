import moment from 'moment';

let origin = 'Hinter dem Brunnen 6, Lüneburg';
let destination = 'Hongkongstr. 1, Hamburg';

let key = 'AIzaSyCgnhgSpNu8XFGDET1mBB8vIwxHeyPwUQ4';
let base = 'https://maps.googleapis.com/maps/api/directions/json';
let url = `${base}?origin=${origin}&destination=${destination}&mode=transit&alternatives=true&key=${key}`;

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
                    ${ moment(route.departure.time).format('HH:mm') } bis ${ moment(route.arrival.time).lang('de').format('HH:mm') }
                </div>
                <div class="c-route__steps">
                    <span class="c-route__stop">von ${route.departure.stop}</span>

                    ${route.steps.map(step =>`
                        <span class="c-route__step">${step.name}</span>
                    `).join(', ')}

                    <span class="c-route__stop">nach ${route.arrival.stop}</span>
                </div>
                <span class="c-route__arrival">
                    ${ route.arrival.stop }
                    ${ moment(route.arrival.time).lang('de').format('HH:mm') }
                </span>
            </div>`;
    });

    let $container = document.querySelector('.c-transit-display');

    $container.innerHTML += `<div class="c-transit-display__header">${origin} » ${destination}</div>`;
    $container.innerHTML += `<div class="c-transit-display__primary-route">${partials[0]}</div>`;
    $container.innerHTML += `<div class="c-transit-display__alternatives">${partials.slice(0, partials.length - 2).join('')}</div>`;

});
