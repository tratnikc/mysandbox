
var locationID = 0;
initPage();
function initPage() {
    var cityname = d3.select("#current-city").text();
    cityname = cityname.trim().toUpperCase();
    console.log(cityname);

    var blurbText = "";
    
    if (cityname === "TORONTO") {
        locationID = 1;
        blurbText = "Generally, the most popular station in Toronto is at station number 7076 located at York St/Queensway W. It is interesting to note that, for annual members, this location is the popular destination for bike users starting from the Sherbourne / Wellesley station while for casual users, the union station and this York St/Queensway W station is the most popular starting point and end point.";
    } else if (cityname === "VANCOUVER") {
        locationID = 2;
        blurbText = "say something about vancouver";
    } else if (cityname === "BOSTON") {
        locationID = 3;
        blurbText = "GENERALLY,  the most bike share usage in Boston occurs during the work week. Ridership drops significantly on the weekends. Destinations Central Station and MIT remain constant throughout the week.";
    } else if (cityname === "NYC") {
        locationID = 4;
        console.log(cityname);
        blurbText = "In New York City, the most popular destination is Pershing Square North, but drops significantly on the weekends. Ridership is higher during the work week. The busiest times of the day are in the morning between 8am-9am and in the evening from 5pm to 7pm.";
    };

    // var blurb = d3.select("#city-blurb");
    // // clear the p tag
    // blurb.html("");

    // var paragraph = blurb.append("p");
    // var p = document.querySelector("p");
    // p.innerText=blurbText;

    console.log(locationID);
    console.log(blurbText);
    var sDate = '01/01/2019';
    var eDate = '12/31/2019';

    var yr1 = sDate.split("/")[2];
    var yr2 = eDate.split("/")[2];

    var startDate = yr1.concat(sDate.split("/")[0], sDate.split("/")[1])
    var endDate = yr2.concat(eDate.split("/")[0], eDate.split("/")[1])


    console.log(startDate);
    console.log(endDate);

    buildPlots(locationID, startDate, endDate);
    cityBlurb(blurbText);
};

function handleSubmit() {
    d3.event.preventDefault();

    var defaultStartDate = '1/1/2019';
    var defaultEndDate = '12/31/2019';

    var startDate = d3.select("#start-date").node().value;
    var endDate = d3.select("#end-date").property("value");

    if (startDate) {
        console.log("not empty date");
    } else {
        console.log("empty empty");
        startDate = defaultStartDate;
    }

    if (endDate) {
        console.log("not empty date");
    } else {
        console.log("empty empty");
        endDate = defaultEndDate;
    }

    var yr1 = startDate.split("/")[2];
    var yr2 = endDate.split("/")[2];

    startDate = yr1.concat(startDate.split("/")[0], startDate.split("/")[1])
    endDate = yr2.concat(endDate.split("/")[0], endDate.split("/")[1])

    console.log(startDate);
    console.log(endDate);
    console.log(locationID);
    buildPlots(locationID, startDate, endDate);

};

function createTimePlot(locationID, startDate, endDate) {
    var url_time = "/api/visualize/time/" + locationID + "/" + startDate + "/" + endDate;
    console.log(url_time);
    console.log(url_time);
    // busiest time of day
    d3.json(url_time).then(function(data) {

        console.log(data);
    
        var data = data;
        start_hour = [];
        count_hour = [];
        sizes = []
    
        Object.entries(data).forEach(([key, value]) => {
            // console.log(key, value);
            count_hour.push(value.hourly_trip_count);
            start_hour.push(value.start_hour);
            sizes.push(value.hourly_trip_count * 0.1)
        });
    
        // console.log(start_hour);
        // console.log(count_hour);
    
        var dataX = [{
            x: start_hour,
            y: count_hour,
            text: start_hour.map(String),
            mode: 'markers',
            marker: {
                color: count_hour,
                colorscale: "Jet"
            },
            type: 'bar'
        }];
    
        var layout1 = {
            title: {
                text: 'Busiest Time of Day',
                font: {
                    size: 16,
                    color: 'blue'
                }
            },
            xaxis: {title: "Time of Day",
                tickmode: 'array',
                tickvals: [0, 3, 6, 9, 12, 15, 18, 21],
                ticktext: ['12mn', '3am', '6am', '9am', '12nn', '3pm', '6pm', '9pm']
            },
            yaxis: {title: "Number of Trips"},
            hovermode: "closest",
            showlegend: false
        };
    
        Plotly.newPlot("bubble-time", dataX, layout1, {responsive: true});
    
    });
}

function createWeatherPlot(locationID, startDate, endDate) {
    var url_hw = "/api/visualize/weather/" + locationID + "/" + startDate + "/" + endDate;
    console.log(url_hw);
    // weather and trip count
    d3.json(url_hw).then(function(weather) {
        // console.log(weather);
        var startDates = [];
        var trip_count = [];
        var sizes = [];
        var texts = [];
        var maxtemp = [];
    
        Object.entries(weather).forEach(([key, value]) => {
            // console.log(value.maxTempC);
            maxtemp.push(value.maxTempC);
            // sizes.push(value.trips * 0.1);
            sizes.push(value.maxTempC + 10);
            texts.push("High: " + value.maxTempC.toString() + " C");
            var d = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Australia/Sydney'
              }).format(value.startDate);
            startDates.push(d);
            trip_count.push(value.trips);
            // console.log(value.trips);
    
        });
    
        // console.log(startDates);
        // console.log(sizes);
        // console.log(trip_count);
        
        var trace1 = {
            x: startDates,
            y: trip_count,
            mode: 'markers',
            type: 'scatter',
            text: texts,
            marker: {
                size: sizes,
                color: sizes,
                colorscale: "Jet"
            },
            type: 'scatter'
        };
    
        var data_hw = [trace1];
    
        var layout_hw = {
            title: { 
                text: 'Temperature and Trips',
                font: {
                    size: 16,
                    color : 'blue'
                }
            },
            xaxis: {
                autotick: false,
                ticks: 'outside',
                tickmode: "auto",
                nticks: 12,
                rangemode: "normal"
            },
            showlegend: false
        };     
        Plotly.newPlot("bar-weather", data_hw, layout_hw, {responsive: true});    
    });

}
function createTopFive(locationID, startDate, endDate) {
    // top 5 destination
    var url_stops = "/api/visualize/destinations/" + locationID + "/" + startDate + "/" + endDate;
    console.log(url_stops);
    // console.log(url_stops);    
    
    d3.json(url_stops).then((stops) => {
        // console.log(stops);
    
        var daysofweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        var dayofweek = [];
    
        var station1 = [];
        var station2 = [];
        var station3 = [];
        var station4 = [];
        var station5 = [];
    
    
        var station_name = [];
    
        var current_stn = 0;
        var current_wk = 1
    
        Object.entries(stops).forEach(([key, value]) => {
            // console.log(value.trip_count);
            // console.log(value.station_name);
            // console.log(value.weekday);
    
            current_stn += 1;
            if (value.weekday != current_wk) {
                current_stn = 1;
                current_wk = value.weekday;
            };
    
            if ( current_stn == 1 ) {
                station1.push(value.trip_count);
            } else if ( current_stn == 2 ) {
                station2.push(value.trip_count);
            } else if ( current_stn == 3 ) {
                station3.push(value.trip_count);
            } else if ( current_stn == 4 ) {
                station4.push(value.trip_count);
            } else if ( current_stn == 5 ) {
                station5.push(value.trip_count);
            };
    
            if (value.weekday == 1) {
                station_name.push(value.station_name);
            }
            
        });
    
    
        var trace1 = {
            x: daysofweek,
            y: station1,
            // text: station1,
            name: station_name[0],
            type: "bar"
        };
    
        
        var trace2 = {
            x: daysofweek,
            y: station2,
            // text: station2,
            name: station_name[1],
            type: "bar"
        };
    
        var trace3 = {
            x: daysofweek,
            y: station3,
            // text: station3,
            name: station_name[2],
            type: "bar"
        };
    
        var trace4 = {
            x: daysofweek,
            y: station4,
            // text: station4,
            name: station_name[3],
            type: "bar"
        };
    
        var trace5 = {
            x: daysofweek,
            y: station5,
            // text: station5,
            name: station_name[4],
            type: "bar"
        };
    
    
        var traceData = [trace1, trace2, trace3, trace4, trace5];
    
        var layoutXY = {
            title: {
                text: "Top 5 Destinations",
                font: {
                    size: 16,
                    color: 'blue'
                }
            },
            barmode: "group"
        };
    
        Plotly.newPlot("bar-station", traceData, layoutXY, {responsive: true});
    
    });
    
}
function buildPlots(locationID, startDate, endDate) {
    createTimePlot(locationID, startDate, endDate);
    createWeatherPlot(locationID, startDate, endDate);
    createTopFive(locationID, startDate, endDate);
}

function cityBlurb(theBlurb) {
    // text for city blurb
    console.log(theBlurb)
    var blurb = d3.select("#city-blurb");
    // clear the p tag
    blurb.html("");

    var paragraph = blurb.append("p");
    var p = document.querySelector("p");
    p.innerText=theBlurb;

}

d3.select("#filter-button").on("click", handleSubmit);