function gridmap() {

    outcomeSelect = d3.select("#statbtns .active").attr("value")
    catSelect = d3.select("#cat-select").property("value");

    data = data_main.filter(function (d) {
        return d.cat == catSelect & d.level == outcomeSelect & d.isstate == 1 & d.fips != 0;
    })

    var rect = d3.selectAll("rect")
        .data(data, function (d) {
            return (d ? d.fips : d3.select(this).attr("fips"));
        })
        .attr("fid", function (d) {
            return "f" + d.fips;
        })
        //.attr("class", "stategrid")
        .attr("fill", function (d) {
            if (d[yearSelect] == "") {
                return "#ececec";
            } else {
                return color(d[yearSelect]);
            }
        })
        .on("click", function (d) {
            dispatch.clickState(d3.select(this).attr("fid"));
        })
        .on("mouseover", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                d3.selectAll("[fid='" + d3.select(this).attr("fid"))
                    .classed("hovered", true)
                    .moveToFront();
                //tooltip(this.id);
                this.parentNode.appendChild(this);
            } else {
                dispatch.hoverState(d3.select(this).attr("fid"));
            }
        })
        .on('mousemove', function (d, i) {
            if (isIE == false) {
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);

                tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                    .style('top', (absoluteMousePos[1] - 50) + 'px');
                var tooltipText = d.name + "<br>" + formatNApct(d[yearSelect]);
                tooltipDiv.html(tooltipText);
            }
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(d3.select(this).attr("fid"));
        });

    //need to put fips on labels in svg for this to work
    /*var labels = d3.selectAll(".st1")
            .data(data, function (d) {
            return (d ? d.fips : d3.select(this).attr("fips"));
        })
        .attr("fid", function (d) {
            return "f" + d.fips;
        })
            .on("click", function (d) {
            dispatch.clickState(d3.select(this).attr("fid"));
        })
        .on("mouseover", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                d3.selectAll("[fid='" + d3.select(this).attr("fid"))
                    .classed("hovered", true)
                    .moveToFront();
                //tooltip(this.id);
                this.parentNode.appendChild(this);
            } else {
                dispatch.hoverState(d3.select(this).attr("fid"));
            }
        })
        .on('mousemove', function (d, i) {
            // Move tooltip
            var absoluteMousePos = d3.mouse(bodyNode);

            tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                .style('top', (absoluteMousePos[1] - 50) + 'px');
            var tooltipText = d.name + "<br>" + formatNApct(d[yearSelect]);
            tooltipDiv.html(tooltipText);
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(d3.select(this).attr("fid"));
        });*/
}

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
        ls_h = 15;

    var legend = svg.selectAll("g.legend")
        .data(COLORS)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("text")
        .data(LEGBREAKS)
        .attr("x", function (d, i) {
            return ((2 * i) * ls_w) + lp_w - 2;
        })
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return FORMATTER(d);
        });

    legend.append("rect")
        .data(COLORS)
        .attr("x", function (d, i) {
            return (i * ls_w) + lp_w;
        })
        .attr("y", 20)
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function (d, i) {
            return COLORS[i];
        })
}