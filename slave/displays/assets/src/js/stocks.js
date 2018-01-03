const CONFIG = '../assets/src/js/config.live.json';
const SYMBOL = 'MSFT';
const URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+SYMBOL+'&interval=60min&apikey=';
let dataSeries = [];
fetch(CONFIG)
    .then(response => response.json())
    .then(config => config.alphavantage.apikey)
    .then((key) => {
        return fetch(URL + key);
    })
    .then(response => response.json())
    .then((response) => {
        console.log(response);

        console.log(response['Time Series (60min)'])

        let data = response['Time Series (60min)'];
        Object.entries(data).forEach(([key, value]) => {
            dataSeries.push(Math.round(value['2. high']));
        });

        console.log(dataSeries)

        let template = `${SYMBOL} : ${dataSeries[dataSeries.length-1]}`;

        document.querySelector('.c-viewport').innerHTML = template;
    })
    .catch((err) => {
        console.error(err);
    });
