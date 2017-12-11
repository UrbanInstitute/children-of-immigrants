var MOBILE_THRESHOLD = 600;

var main_data_url = "data/areadata.csv";
var map_data_url = "data/metros.json";
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
    outcomeSelect,
    stateSelect,
    catSelect,
    yearSelect = "y2013",
    linedata;
var tooltipDiv,
    bodyNode = d3.select('body').node();

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    blue8: ["#CFE8F3", "#A2D4EC", "#73BFE2", "#46ABDB", "#1696D2", "#12719E", "#0A4C6A", "#062635"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#1696d2", "#00578b"],
    gray5: ["#ECECEC", "#DCDBDB", "#ccc", "#777", "#000"]
};

var FORMATTER = d3.format("%");
var COLORS = palette.blue8;
var BREAKS = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
var us;

//universal color ramp for maps
var color = d3.scale.threshold()
    .domain(BREAKS)
    .range(COLORS);

var dispatch = d3.dispatch("load", "change", "yearChange", "hoverState", "hoverMap", "dehoverState", "clickState");
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
//console.log(isIE);

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
        this.parentNode.parentNode.appendChild(this.parentNode);
    });
};

//select the metric to display using dynamic buttons
var selecter = d3.select("#cat-select");

function makebtns() {
    catSelect = selecter.property("value");
    d3.select("#cat-text")
        .html(cattext[catSelect]);

    $("#statbtns").empty();

    var labels = d3.select("#statbtns").selectAll("label")
        .data(levels[catSelect])
        .enter()
        .append("label")
        .attr("class", "urban-button btn")
        .attr("value", function (d, i) {
            return i + 1;
        })
        .text(function (d) {
            return d;
        })
        .insert("input")
        .attr({
            type: "radio",
            name: "outcome",
            value: function (d, i) {
                return i + 1;
            }
        });
    d3.select('label[value="1"]')
        .classed("active", true);
    //ensure that you can still change outcomes after changing categories
    outcomechange();
};

makebtns();
outcomeSelect = d3.select("#statbtns .active").attr("value")

selecter.on("change", function () {
    makebtns();
    dispatch.change(1);
});

//on changing outcome buttons, change the graphs
function outcomechange() {
    $('input:radio[name="outcome"]').change(function (metric) {
        var metric = $(this).val();
        dispatch.change(metric);
        //console.log(metric);
    });
}
outcomechange();

//recolor the maps after changing the outcome or year displayed
function recolor() {
    //recolor geo maps
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
}

//changing the metric shown changes: map coloring, line chart. Eventually: legend, breaks
dispatch.on("change", function (metric) {
    outcomeSelect = metric;
    catSelect = selecter.property("value");
    
    //remove hover class and tooltips
    d3.selectAll(".hovered")
        .classed("hovered", false);
    d3.select('body').selectAll('div.tooltip').remove();
    //tooltipDiv.remove();

    function updateData() {
        data = data_main.filter(function (d) {
            return d.cat == catSelect & d.level == metric;
        })
        data.forEach(function (d) {
            d.fips = +d.fips;
            if (d[yearSelect] == "") {
                VALUE[d.fips] = null;
            } else {
                VALUE[d.fips] = +d[yearSelect];
            }
        });
    };

    function updateGraphs() {
        recolor();
        statelines();
        metrolines();
    }

    //need promise w/ gridmap to get around asynchronous data loading
    var promise = new Promise(function (resolve, reject) {
        outcomeSelect = metric;
        catSelect = selecter.property("value");
        //console.log("hi");

        var resp = updateData();
        resolve(resp)
    })
    promise.then(function (result) {
        return updateGraphs(result);
        //console.log("bye");
    })

});

//by changing the year, update the viz - good example to check functionality is "Household owns home"
//note - this is getting a "data is undefined error bc yearChange is called in highlightLayer which is called when the animator loads on page load. doesn't cause issues but deal with this later
dispatch.on("yearChange", function (year) {

    yearSelect = year;
    if(typeof(data) != "undefined"){
        data.forEach(function (d) {
            //d.fips = +d.fips;
            if (d[yearSelect] == "") {
                VALUE[d.fips] = null;
            } else {
                VALUE[d.fips] = +d[yearSelect];
            }
        });
    }

    recolor();
});

dispatch.on("hoverState", function (areaName) {
    d3.selectAll("[fid='" + areaName + "']")
        .classed("hovered", true);
    d3.selectAll("[fid='" + areaName + "']")
        .moveToFront();

    //tooltips
    // Clean up lost tooltips
    d3.select('body').selectAll('div.tooltip').remove();
    // Append tooltip
    tooltipDiv = d3.select('body').append('div').attr('class', 'map-tooltip');
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
        .style('top', (absoluteMousePos[1] - 50) + 'px')
        .style('position', 'absolute')
        .style('z-index', 1001);
    // Add text using the accessor function
    var tooltipText = areaName;
});



//declass "hovered"
dispatch.on("dehoverState", function (areaName) {
    //console.log(areaName);
    d3.selectAll("[fid='" + areaName + "']")
        .classed("hovered", false);
    tooltipDiv.remove();
});


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
    legend();
    metromap();
    statemap();
    statelines();
    metrolines();
}


$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(main_data_url, function (rates) {
            d3.json(map_data_url, function (mapdata) {
                data_main = rates;
                us = mapdata;
                //data = data_main;

                drawgraphs();
                window.onresize = drawgraphs;
            });
        });
    }
});