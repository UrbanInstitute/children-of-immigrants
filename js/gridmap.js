function gridmap() {

    outcomeSelect = d3.select("#outcome-select").property("value");

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

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
            if (d[yearSelect] == "") {
                return "#ececec";
            } else {
                return color(d[yearSelect]);
            }
        });
}