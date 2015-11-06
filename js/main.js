var MOBILE_THRESHOLD = 600;

var main_data_url = "data/areadata.csv";
var long_data_url = "data/areadata_long.csv";
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
    LABELS,
    stateSelect,
    outcomeSelect,
    yearSelect;

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#1696d2", "#00578b"],
    gray5: ["#ECECEC", "#DCDBDB", "#ccc", "#777", "#000"]
};

var FORMATTER = d3.format("%");
var COLORS = palette.blue5;
var BREAKS = [0.2, 0.4, 0.6, 0.8];
var us;

var dispatch = d3.dispatch("load", "change", "yearChange", "hoverState", "dehoverState", "clickState");
var menuId;

function formatNApct(d) {
        if (d == "" | d == null) {
            return "NA";
        } else {
            return FORMATTER(d);
        }
    }

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
var isIE = detectIE();

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
        this.parentNode.parentNode.appendChild(this.parentNode);
    });
};

var selecter = d3.select("#outcome-select")
dispatch.on("load.menu", function (metric) {
    //populate the dropdowns using main csv's metric names
    selecter.on("change", function () {
        dispatch.change(metric.get(this.value));
    });

    selecter.selectAll("option")
        .data(metric.values())
        .enter().append("option")
        .attr("value", function (d) {
            return d.statcode;
        })
        .text(function (d) {
            return d.statlabel;
        });
});

//changing the metric shown changes: map coloring, line chart. Eventually: legend, breaks, text
dispatch.on("change.menu", function () {
    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);
    outcomeSelect = selecter.property("value");
    statelines();
    metrolines();
    gridmap();

    data = data_main.filter(function (d) {
        return d.statcode == outcomeSelect;
    })
    data.forEach(function (d) {
        d.fips = +d.fips;
        if (d[yearSelect] == "") {
            VALUE[d.fips] = null;
        } else {
            VALUE[d.fips] = +d[yearSelect];
        }
    });
    d3.selectAll("path.statemap")
        .attr("fill", function (d) {
            if (VALUE[d.id] == null) {
                return "#ececec";
            } else {
                return color(VALUE[d.id]);
            }
        });
    d3.selectAll("path.metros")
        .attr("fill", function (d) {
            if (VALUE[d.id] == null) {
                return "#fff";
            } else {
                return color(VALUE[d.id]);
            }
        });
    tooltip("f0");
});

//by changing the year, update the viz - good example to check functionality is "Household owns home"
//note - this is getting a "data is undefined error bc yearChange is called in highlightLayer which is called when the animator loads on page load. doesn't cause issues but deal with this later
dispatch.on("yearChange", function (year) {
    yearSelect = year;

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    data.forEach(function (d) {
        d.fips = +d.fips;
        if (d[yearSelect] == "") {
            VALUE[d.fips] = null;
        } else {
            VALUE[d.fips] = +d[yearSelect];
        }
    });

    d3.selectAll("rect")
        .attr("d", function (d) {
            return d[yearSelect];
        })
        .attr("fill", function (d) {
            if (d[yearSelect] == "") {
                return "#ececec";
            } else {
                return color(d[yearSelect]);
            }
        });

    d3.selectAll("path.statemap")
        .attr("fill", function (d) {
            if (VALUE[d.id] == null) {
                return "#ececec";
            } else {
                return color(VALUE[d.id]);
            }
        });
    d3.selectAll("path.metros")
        .attr("fill", function (d) {
            if (VALUE[d.id] == null) {
                return "#fff";
            } else {
                return color(VALUE[d.id]);
            }
        });
    //tooltip("f0");
});

//on hover, class those states "hovered"
dispatch.on("hoverState", function (areaName) {
    d3.selectAll("[fid='" + areaName + "']")
        .classed("hovered", true);
    d3.selectAll("[fid='" + areaName + "']".chartline)
        .moveToFront();
    tooltip(areaName);
});

//declass "hovered" and return tooltip back to value in dropdowns
dispatch.on("dehoverState", function (areaName) {
    d3.selectAll("[fid='" + areaName).classed("hovered", false);
    //menuId = selecter.property("value");
    tooltip("f0");
    //d3.selectAll("[id='" + menuId + "']")
    //    .moveToFront();
});

function tooltip(state) {
    var row = data.filter(function (d) {
        return "f" + d.fips == state;
    });

    row.forEach(function (d) {
        d3.selectAll(".tt-name").text(d.name);
        d3.select("#tt-year").text(yearSelect.slice(1));
        d3.select("#tt-num").text(formatNApct(VALUE[d.fips]));
    });
}

function statemap() {
    $GRAPHDIV = $("#statemap");
    STATEMAP = 1;
    cbsamap("#statemap");
}

function statelines() {
    $GRAPHDIV = $("#statelines");
    STATEMAP = 1;
    isMobile = false;
    linechart("#statelines");
}

function metromap() {
    $GRAPHDIV = $("#metromap");
    STATEMAP = 0;
    cbsamap("#metromap");
}

function metrolines() {
    $GRAPHDIV = $("#metrolines");
    STATEMAP = 0;
    isMobile = false;
    linechart("#metrolines");
}

function drawgraphs() {
    metromap();
    //statemap();
    statelines();
    metrolines();
    gridmap();
}


$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(main_data_url, function (rates) {
            d3.json(map_data_url, function (mapdata) {
                data_main = rates;
                us = mapdata;

                yearSelect = "y2009";
                
                var metric = d3.map();
                data_main.forEach(function (d) {
                    metric.set(d.statlabel, d);
                });
                dispatch.load(metric);

                drawgraphs();
                window.onresize = drawgraphs;
            });
        });
    }
});