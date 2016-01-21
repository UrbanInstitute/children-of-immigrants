var map_aspect_width = 1,
    map_aspect_height = 0.7;

var $legend = $("#legend");

var LEGBREAKS = [0, 0.25, 0.5, 0.75, 1];

function legend() {
    var margin = {
        top: 3,
        right: 15,
        bottom: 2,
        left: 15
    };

    var width = $legend.width() - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

    $legend.empty();

    var svg = d3.select("#legend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lp_w = 0,
        ls_w = (width / COLORS.length),
        ls_h = 20;

    var legend = svg.selectAll("g.legend")
        .data(COLORS)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("text")
        .data(LEGBREAKS)
        .attr("x", function (d, i) {
            return ((2 * i) * ls_w) + lp_w - 2;
        })
        .attr("y", 17)
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return FORMATTER(d);
        });

    legend.append("rect")
        .data(COLORS)
        .attr("x", function (d, i) {
            return (i * ls_w) + lp_w;
        })
        .attr("y", 22)
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function (d, i) {
            return COLORS[i];
        })
}

//map - option for state or metro view
function cbsamap(div) {

    outcomeSelect = d3.select("#statbtns .active").attr("value")
    catSelect = d3.select("#cat-select").property("value");

    data = data_main.filter(function (d) {
        return d.cat == catSelect & d.level == outcomeSelect & d.fips != 0;
    })

    data.forEach(function (d) {
        d.fips = +d.fips;
        if (d[yearSelect] == "") {
            VALUE[d.fips] = null;
        } else {
            VALUE[d.fips] = +d[yearSelect];
        }
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

    var projection = d3.geo.albersUsa()
        .scale(width * 1.3)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    if (STATEMAP == 0) {

        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.coicbsa).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fid", function (d) {
                return "f" + d.id;
            })
            .attr("class", "metros")
            .attr("fill", function (d) {
                if (VALUE[d.id] != null) {
                    return color(VALUE[d.id]);
                } else {
                    return "#fff";
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
                    var tooltipText = d.properties.name + "<br>" + formatNApct(VALUE[d.id]);
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
                    var tooltipText = d.properties.name + "<br>" + formatNApct(VALUE[d.id]);
                    tooltipDiv.html(tooltipText);
                }
            })
            .on("mouseout", function (d) {
                if (isIE != false) {
                    d3.select('body').selectAll('div.tooltip').remove();
                    tooltipDiv.remove();
                } else {
                    dispatch.dehoverState(d3.select(this).attr("fid"));
                }
            })
            .on("mouseleave", function (d) {
                if (isIE != false) {
                    d3.selectAll(".hovered")
                        .classed("hovered", false);
                    d3.select('body').selectAll('div.tooltip').remove();
                    tooltipDiv.remove();
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
            .attr("fid", function (d) {
                return "f" + d.id;
            })
            .attr("class", "statemap")
            .attr("fill", function (d) {
                if (VALUE[d.id] == null) {
                    return "#ececec";
                } else {
                    return color(VALUE[d.id]);
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
                    var tooltipText = d.properties.name + "<br>" + formatNApct(VALUE[d.id]);
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
                    var tooltipText = d.properties.name + "<br>" + formatNApct(VALUE[d.id]);
                    tooltipDiv.html(tooltipText);
                }
            })
            .on("mouseout", function (d) {
                dispatch.dehoverState(d3.select(this).attr("fid"));
            })
            .on("mouseleave", function (d) {
                if (isIE != false) {
                    d3.select('body').selectAll('div.tooltip').remove();
                    tooltipDiv.remove();
                    d3.selectAll(".hovered")
                        .classed("hovered", false);
                }
            });
    }
}