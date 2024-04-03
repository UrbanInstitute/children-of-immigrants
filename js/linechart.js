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
        .domain([2006, 2022])
        .range([0, width])

    //this set creates a list of odd numbered years for ticks
    /*var xValues = new Array() //x.domain()[1] - x.domain()[0] + 1 
    for (i = x.domain()[0]; i <= x.domain()[1]; i ++){
        if (i == x.domain()[0] || i % 2 == 1) xValues.push(i)
    }*/

    var color = d3.scale.ordinal()
        .range(["#ccc"]);

    var voronoi = d3.geom.voronoi()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.val); })
        .clipExtent([[0, 0], [width, height]]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(16) //this is a rough count and may need updated as years are added
        //.tickValues(xValues) //for odd numbered years only
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
        //always show US line
        return d.cat == catSelect & d.level == outcomeSelect & d.isstate == STATEMAP;

        /*if (catSelect == "main" & outcomeSelect > 1) {
            return d.cat == catSelect & d.level == outcomeSelect & d.isstate == STATEMAP & d.fips != 0; 
        } else {
            return d.cat == catSelect & d.level == outcomeSelect & d.isstate == STATEMAP;
        }*/
    })

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key == "name";
    }));

    //nest data by fips, then have one year-value pair for each year in datayears
    var datayears = ["y2006", "y2007", "y2008", "y2009", "y2010", "y2011", "y2012", "y2013", "y2014", "y2015", "y2016", "y2017", "y2018", "y2019","y2020","y2021","y2022"];
    var linegroups = linedata.map(function (d) {
        return {
            fips: +d.fips,
            name: d.name,
            values: datayears.map(function (y) {
                return {
                    fips: +d.fips,
                    name: d.name,
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
        //commented out
        /* .on("mouseover", function (d) {
             chartMouseover("f" + d.fips, d.name);
         })
         .on('mousemove', function (d, i) {
             chartMousemove(d.name);
         })
         .on("mouseout", function (d) {
             chartMouseout("f" + d.fips);
         })
         .on("mouseleave", function (d) {
             chartMouseleave();
         });*/

    var voronoiGroup = svg.append("g")
        .attr("class", "voronoi");

    voronoiGroup.selectAll("path")
        .data(voronoi(d3.merge(linegroups.map(function(d) { return d.values; }))))
        .enter().append("path")
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
        .on("mouseover", function (d) {
            chartMouseover("f" + d.point.fips, d.point.name);
        })
        .on('mousemove', function (d, i) {
            chartMousemove(d.point.name);
        })
        .on("mouseout", function (d) {
            chartMouseout("f" + d.point.fips);
        })
        .on("mouseleave", function (d) {
            chartMouseleave();
        });

}

function chartMouseover(fid, name) {
    if (isIE != false) {
        d3.selectAll(".hovered")
            .classed("hovered", false);
        d3.selectAll("[fid='" + fid)
            .classed("hovered", true)
            .moveToFront();
        //tooltips
        // Clean up lost tooltips
        //d3.select('body').selectAll('div.tooltip').remove();
        // Append tooltip
        //tooltipDiv = d3.select('body').append('div').attr('class', 'map-tooltip');
        tooltipDiv.style('display','block')
        var absoluteMousePos = d3.mouse(bodyNode);
        tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
            .style('top', (absoluteMousePos[1] - 50) + 'px')
            .style('position', 'absolute')
            .style('z-index', 1001);
        // Add text using the accessor function
        var tooltipText = name;
        tooltipDiv.html(tooltipText);
    } else {
        //console.log("chart mouseover")
        dispatch.hoverState(fid);
    }
}

function chartMouseout(fid) {
    dispatch.dehoverState(fid);
}

function chartMousemove(name) {
    if (isIE != false) {
        d3.selectAll(".hovered").classed("hovered", false);
        //d3.select('body').selectAll('div.tooltip').remove();
        //tooltipDiv.remove();
        tooltipDiv.style('display','none')
    } else {
        // Move tooltip
        var absoluteMousePos = d3.mouse(bodyNode);

        tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
            .style('top', (absoluteMousePos[1] - 50) + 'px');
        var tooltipText = name;
        tooltipDiv.html(tooltipText);
    }
}

function chartMouseleave() {
    if (isIE != false) {
        d3.selectAll(".hovered").classed("hovered", false);
        //d3.select('body').selectAll('div.tooltip').remove();
        //tooltipDiv.remove();
        tooltipDiv.style('display','none')
    }
}