var MOBILE_THRESHOLD = 600;

var main_data_url = "data/areadata.csv";
var metro_data_url = "data/metros.txt";
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

//map of value estimate
function cbsamap(div) {

    data.forEach(function (d) {
        d.FIPS = +d.FIPS;
        VALUE[d.FIPS] = +d.y2009;
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
            d3.json(metro_data_url, function (metrodata) {
                data_main = rates;
                us = metrodata;

                drawgraphs();
                window.onresize = drawgraphs;
            });
        });
    }
});