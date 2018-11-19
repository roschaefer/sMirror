import moment from 'moment';
import timespans from './weather/timespans.js';
import icons from './weather/icons.js';

// api configuration
let base = 'https://api.openweathermap.org/data/2.5/';
let location = 'Lüneburg';
let key = process.env.WEATHER_API_KEY;

let current  = `${base}/weather?q=${location}&APPID=${key}`;
let forecast = `${base}/forecast?q=${location}&APPID=${key}`;

window.onload = () => {
    // load radar imagery asynchronously
    let radar = new Image();
    let url   = 'https://www.dwd.de/DWD/wetter/radar/radfilm_nib_akt.gif';
    let $container = document.querySelector('.c-weather-display__radar');

    radar.onload = () => {
        $container.innerHTML = '';
        $container.appendChild(radar);
    };

    radar.src = url;

    // load and render weather data
    let weatherData = [];

    Promise.all([

        fetch(forecast, {
            method: 'get',
            mode: 'cors',
        }).then((response) => {
            return response.json();
        }).then((data) => {
            let items = data.list.slice(0, 6).filter((item, index) => {
                return index % 3 === 0;
            });
            weatherData.push(...items);
        }),
        fetch(current, {
            method: 'get',
            mode: 'cors',
        }).then((response) => {
            return response.json();
        }).then((data) => {
            weatherData.push(data);
        })

    ]).then(() => {
        let items = weatherData
            .sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            })
            .map((item, index) => {

                let date = new Date(parseInt(item.dt) * 1000);
                let timespan = timespans.filter((span) => {
                    return span.intervall[0] <= date.getHours() && date.getHours() < span.intervall[1];
                })[0];

                return {
                    time: timespan,
                    temp: Math.round(item.main.temp - 273.51),
                    weather: item.weather[0].main,
                    icon: icons[item.weather[0].id] + timespan.daytime.slice(0, 1) + '.svg',
                };

            })
            .forEach((item, index) => {

                let template = `
                        <div class="c-weather-display__tile">
                            <div class="c-weather-tile ${index === 0 ? 'c-weather-tile--current' : ''}">
                                <div class="c-weather-tile__time">${item.time.label}</div>
                                <img class="c-weather-tile__icon" src="icons/${item.icon}" alt="${item.weather}" />
                                <div class="c-weather-tile__temp">${item.temp} °C</div>
                            </div>
                        </div>`;

                document.querySelector('.c-weather-display__forecast').innerHTML += template;

            });

    });

};
