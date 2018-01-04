const CONFIG = '../assets/src/js/config.live.json';

const SYMBOLS = [
    {name: 'DAX', symbol: '%5EGDAXI', currency: '€'},
    {name: 'Bitcoin-Euro', symbol: 'BTC-EUR', currency:'€'}
];
const TIMESPAN = 'TIME_SERIES_DAILY';


let currentSymbol = SYMBOLS[1];
const URL = 'https://www.alphavantage.co/query?function=' + TIMESPAN + '&symbol=' + currentSymbol.symbol + '&interval=60min&apikey=';

// TODO
// draw chart
// datafield depending on TIMESPAN
// bulk retrieval of stock data

let data = [];
const DATA_TEMPLATE = {
    series: [],
    startTime: null,
    endTime: null,
    symbol: null
};

fetch(CONFIG)
    .then(response => response.json())
    .then(config => config.alphavantage.apikey)
    .then(key => fetch(URL + key))
    .then(response => response.json())
    .then((response) => {
        console.log(response);
        console.log(response['Time Series (Daily)'])

        // new data object for this dataset
        let currentData = Object.assign({}, DATA_TEMPLATE);

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
        currentData.symbol = currentSymbol.symbol;
        // add to overall data
        data.push(currentData);

        // show something
        let template = `
            <div class="c-stock__symbol">${currentSymbol.name}: </div>
            <div class="c-stock__value"> ${(currentData.series[currentData.series.length - 1].value)}</div>
            <div class="c-stock__currency"> ${currentSymbol.currency}</div>
            <div class="c-stock__chart" id="chart-${currentSymbol.name}"></div>
            
        `;
        document.querySelector('.c-viewport').innerHTML = template;


        generateChart(data[0].series, '#chart-' + currentSymbol.name);
    })
    .then(() => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });


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
            return x(d.date);
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
        d.date = parseTime(d.date);
        d.value = +d.value;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.date;
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