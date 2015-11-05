function gridmap() {

    outcomeSelect = d3.select("#outcome-select").property("value");

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    data = data_main.filter(function (d) {
        return d.statcode == outcomeSelect & d.isstate == 1;
    })

    var rect = d3.selectAll("rect")
        .data(data)
        .enter().append("rect")

    var rects = d3.selectAll("rect")
        .data(data, function (d) {
            return d.fips;
        })
        .attr("id", function (d) {
            return "m" + d.fips;
        })
        //.attr("class", "stategrid")
        .attr("fill", function (d) {
            if (d[yearSelect] == "") {
                return "#ececec";
            } else {
                return color(d[yearSelect]);
            }
        })
        .on("mouseover", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                d3.selectAll("#" + this.id)
                    .classed("hovered", true)
                    .moveToFront();
                //tooltip(this.id);
                this.parentNode.appendChild(this);
            } else {
                dispatch.hoverState(this.id);
            }
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(this.id);
        });


}