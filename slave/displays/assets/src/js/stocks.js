import keys from './config/keys.js';

// needs an api key from alphavantage.co -> https://www.alphavantage.co/support/#api-key

// list of all stocks to be retrieved
const SYMBOLS = [
    {name: 'DAX', symbol: '%5EGDAXI', currency: '€'},
    {name: 'Bitcoin-Euro', symbol: 'BTC-EUR', currency: '€'},
    {name: 'Microsoft', symbol: 'MSFT', currency: '$'}
];

const UPDATE_DELAY = 3 * 1000; // 20 sekunden

const TIMESPAN = 'TIME_SERIES_DAILY';

let currentIndex = 0;

let data = [];
let promises = [];


window.onload = () => {


    SYMBOLS.forEach(s => {
      let url = 'http://stocks.smirror.canopus.uberspace.de/?symbol=' + s.symbol + '&apikey=' + keys.stocks;

        promises.push(fetch(url)
            .then(response => response.json())
            .then(response => {
                // console.log(response['Time Series (Daily)']);

                // new data object for this dataset
                let currentData = {
                    series: [],
                    startTime: null,
                    endTime: null,
                    symbol: null,
                    name: null,
                    currency: null
                };

                // retrieve all entries from key: '4. close'
                let responseData = response['Time Series (Daily)'];
                Object.entries(responseData).forEach(([key, value]) => {
                    currentData.series.push({date: key, value: Number(value['4. close']).toFixed(2)});
                });

                // extract start & end of series
                let dates = Object.keys(responseData);
                currentData.startTime = dates[dates.length - 1];
                currentData.endTime = dates[0];

                // reverse order to get newest entry at the end
                currentData.series = currentData.series.reverse();

                // set symbol for this dataset
                currentData.symbol = s.symbol;
                currentData.name = s.name;
                currentData.currency = s.currency;
                // add to overall data
                data.push(currentData);
            }));
    });


// just used as timer for all returning promnises
    Promise.all(promises)
        .then(() => {
            update();
        })
        .catch((err) => {
            console.error(err);
        });

    let update = () => {
        showEntry(data[currentIndex]);
        currentIndex++;
        if (currentIndex > data.length - 1) {
            currentIndex = 0;
        }
        setTimeout(update, UPDATE_DELAY)
    };

    let showEntry = (currentData) => {

        // show something
        let template = `
            <div class="c-stock__symbol">${currentData.name}: </div>
            <div class="c-stock__value"> ${(currentData.series[currentData.series.length - 1].value)}</div>
            <div class="c-stock__currency"> ${currentData.currency}</div>
            <div class="c-stock__chart" id="chart-${currentData.name}"></div>
            
        `;
        document.querySelector('.c-viewport').innerHTML = template;
        generateChart(currentData.series, '#chart-' + currentData.name);
    };


    let generateChart = (data, selector) => {
        // set the dimensions and margins of the graph
        let margin = {top: 20, right: 20, bottom: 30, left: 50};
        let width = 700 - margin.left - margin.right;
        let height = 330 - margin.top - margin.bottom;

        // parse the date / time
        let parseTime = d3.timeParse("%Y-%m-%d");

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        // define the line
        let valueline = d3.line()
            .x(function (d) {
                return x(d.dateParsed);
            })
            .y(function (d) {
                return y(d.value);
            });

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // format the data
        data.forEach(function (d) {
            d.dateParsed = parseTime(d.date);
            d.value = +d.value;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.dateParsed;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

    };
}
