var MOBILE_THRESHOLD = 600;

var main_data_url = "data/areadata.csv";
var map_data_url = "data/metros.txt";
var data, data_main;
var FORMATTER,
    STATEMAP,
    VAL,
    VALUE = {},
    LINEVAL,
    YEARVAL,
    NUMTICKS,
    $GRAPHDIV,
    $LEGENDDIV,
    $statemultiples = $('#statemultiples'),
    COLORS,
    BREAKS,
    LABELS,
    stateSelect,
    height_multiplier;

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#1696d2", "#00578b"],
    gray5: ["#ECECEC", "#DCDBDB", "#ccc", "#777", "#000"]
};

var us,
    map_aspect_width = 1,
    map_aspect_height = 0.7;

var dispatch = d3.dispatch("load", "statechange", "hoverState", "dehoverState", "clickState");
var menuId;
var selecter = d3.selectAll(".stateselect")

dispatch.on("load.menu", function (stateById) {
    //populate the dropdowns using main csv's state names & abbreviations
    selecter.on("change", function () {
        dispatch.statechange(stateById.get(this.value));
    });

    selecter.selectAll("option")
        .data(stateById.values())
        .enter().append("option")
        .attr("value", function (d) {
            return d.STATCODE;
        })
        .text(function (d) {
            return d.STAT;
        });
});

//map animation over years
function animater() {

    var last_layer;

    var control = document.getElementById('layers');

    // Add a play button div
    var play_button = control.appendChild(document.createElement('a'))
    var pause = "&#9616;&#9616;";
    var play = "&#9654;";
    play_button.innerHTML = play;
    play_button.id = "play_button";
    play_button.onclick = function () {
        if (nextInterval) {
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        } else {
            highlightLayer(i++);
            nextInterval = animate();
            play_button.innerHTML = pause;
        }
    }
    
    var layers = [{
        name: "'06"
     }, {
        name: "'07"
     }, {
        name: "'08"
     }, {
        name: "'09"
     }, {
        name: "'10"
     }, {
        name: "'11"
     }, {
        name: "'12"
     }, {
        name: "'13"
     }];


    layers.forEach(function (layer, n) {

        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function () {
            highlightLayer(n);
            i = n;
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        };
    });

    // we use a layer group to make it simple to remove an existing overlay
    // and add a new one in the same line of code, as below, without juggling
    // temporary variables.
    //var layerGroup = L.layerGroup().addTo(map);

    // i is the number of the currently-selected layer
    var i = 0;

    // show the first overlay as soon as the map loads
    //highlightLayer(i++);

    var nextInterval;

    function animate() {
        // and then time the next() function to run every 1 seconds
        return setInterval(function () {
            highlightLayer(i);
            if (++i >= layers.length) i = 0;
        }, 1000 * 1);

    }

   function highlightLayer(i) {
        //layerGroup.clearLayers().addLayer(layers[i].layer);
        var active = control.getElementsByClassName('active');
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';
    }
}
animater();

function statemap() {
    data = data_main.filter(function (d) {
        return d.STATCODE == "pov100" & d.ISSTATE == 1;
    })
    $GRAPHDIV = $("#statemap");
    STATEMAP = 1;
    BREAKS = [0.1, 0.2, 0.3, 0.4];
    COLORS = palette.blue5;
    VAL = "y2009";
    cbsamap("#statemap");
}

function metromap() {
    data = data_main.filter(function (d) {
        return d.STATCODE == "pov100" & d.ISSTATE == 0;
    })
    $GRAPHDIV = $("#metromap");
    STATEMAP = 0;
    BREAKS = [0.1, 0.2, 0.3, 0.4];
    COLORS = palette.blue5;
    VAL = "y2009";
    cbsamap("#metromap");
}

//map - option for state or metro view
function cbsamap(div) {

    data.forEach(function (d) {
        d.FIPS = +d.FIPS;
        VALUE[d.FIPS] = +d.y2011;
    });

    var margin = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5
    };

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * map_aspect_height) / map_aspect_width) - margin.top - margin.bottom;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    var projection = d3.geo.albersUsa()
        .scale(width * 1.3)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    if (STATEMAP == 0) {
        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.tl_2015_us_cbsa).features)
            .enter().append("path")
            .attr("d", path)
            .attr("mid", function (d) {
                return "m" + d.id;
            })
            .attr("class", "metros")
            .attr("fill", function (d) {
                if (VALUE[d.id] != null) {
                    return color(VALUE[d.id]);
                } else {
                    return "#fff";
                }
            });

        svg.append("g")
            .attr("class", "stateborders")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.cb_2014_us_state_20m).features)
            .enter().append("path")
            .attr("d", path);
    } else {
        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.cb_2014_us_state_20m).features)
            .enter().append("path")
            .attr("d", path)
            .attr("mid", function (d) {
                return "m" + d.id;
            })
            .attr("class", "statemap")
            .attr("fill", function (d) {
                if (VALUE[d.id] != null) {
                    return color(VALUE[d.id]);
                } else {
                    return "#fff";
                }
            });
    }
}


function drawgraphs() {
    metromap();
    statemap();
}


$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(main_data_url, function (rates) {
            d3.json(map_data_url, function (mapdata) {
                data_main = rates;
                us = mapdata;
                
                var stateById = d3.map();
                    data_main.forEach(function (d) {
                        stateById.set(d.STATCODE, d);
                    });
                    dispatch.load(stateById);

                drawgraphs();
                window.onresize = drawgraphs;
            });
        });
    }
});