var linechart_aspect_width = 1;
var linechart_aspect_height = 0.8;
var NUMTICKS = 6;

var yearf = d3.format("02d");

function formatYear(d) {
    return "'" + yearf(Math.abs(2000 - d));
}


function linechart(div, id) {
    var margin = {
        top: 25,
        right: 15,
        bottom: 45,
        left: 40
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $GRAPHDIV.empty();

    var x = d3.scale.linear()
        .domain([2006, 2013])
        .range([0, width]);

    var color = d3.scale.ordinal()
        .range(["#ccc"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatYear);

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    outcomeSelect = d3.select("#statbtns .active").attr("value")
    catSelect = d3.select("#cat-select").property("value");

    var max = catmax[catSelect];
    FORMATTER = d3.format("%");

    var y = d3.scale.linear()
        .domain([0, max])
        .range([height, 0]);

    linedata = data_main.filter(function (d) {
        if (catSelect == "main" & outcomeSelect > 1) {
            return d.cat == catSelect & d.level == outcomeSelect & d.isstate == STATEMAP & d.fips != 0;
        } else {
            return d.cat == catSelect & d.level == outcomeSelect & d.isstate == STATEMAP;
        }
    })

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key == "name";
    }));

    //nest data by fips, then have one year-value pair for each year in datayears
    var datayears = ["y2006", "y2007", "y2008", "y2009", "y2010", "y2011", "y2012", "y2013"];
    var linegroups = linedata.map(function (d) {
        return {
            fips: +d.fips,
            name: d.name,
            values: datayears.map(function (y) {
                return {
                    year: +y.slice(1),
                    val: +d[y]
                };
            })
        };
    });

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis-show")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(y)
        .outerTickSize(0)
        .tickFormat(FORMATTER)
        .orient("left")
        .ticks(NUMTICKS);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var line = d3.svg.line()
        .defined(function (d) {
            return d.val != "";
        })
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.val);
        });

    var states = svg.selectAll(".state")
        .data(linegroups)
        .enter().append("g")
        .attr("class", "state");

    states.append("path")
        .attr("class", "chartline")
        .attr("d", function (d) {
            return line(d.values);
        })
        .attr("fid", function (d) {
            return "f" + d.fips;
        })
        .attr("stroke", function (d) {
            if (d.fips == 0) {
                return "#000";
            } else {
                return "#ccc";
            }
        })
        .on("mouseover", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                d3.selectAll("[fid='" + d3.select(this).attr("fid"))
                    .classed("hovered", true)
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
                var tooltipText = d.name;
                tooltipDiv.html(tooltipText);
            } else {
                dispatch.hoverState(d3.select(this).attr("fid"));
            }
        })
        .on('mousemove', function (d, i) {
            if (isIE != false) {
                d3.select('body').selectAll('div.tooltip').remove();
                tooltipDiv.remove();
            } else {
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);

                tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                    .style('top', (absoluteMousePos[1] - 50) + 'px');
                var tooltipText = d.name;
                tooltipDiv.html(tooltipText);
            }
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(d3.select(this).attr("fid"));
        })
        .on("mouseleave", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                d3.select('body').selectAll('div.tooltip').remove();
                tooltipDiv.remove();
            }
        });

}