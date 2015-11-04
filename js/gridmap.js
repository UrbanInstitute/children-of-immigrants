var COLORS = palette.blue5;
var BREAKS = [0.2, 0.4, 0.6, 0.8];

function gridmap() {

    outcomeSelect = d3.select("#outcome-select").property("value");

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    d3.csv(main_data_url, function (data_main) {
        data = data_main.filter(function (d) {
            return d.statcode == outcomeSelect & d.isstate == 1;
        })

        var rects = d3.selectAll("rect")
            .data(data)
            .attr("d", function (d) {
                return d[yearSelect];
            })
            //.attr("class", "stategrid")
            .attr("fill", function (d) {
                return color(d[yearSelect]);
            });
    });
}