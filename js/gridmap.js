var main_data_url = "data/areadata.csv";
var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#1696d2", "#00578b"],
    gray5: ["#ECECEC", "#DCDBDB", "#ccc", "#777", "#000"]
};


var COLORS = palette.blue5;
var BREAKS = [0.2, 0.4, 0.6, 0.8];
var VALUE = {};

function gridmap() {
    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    d3.csv(main_data_url, function (data_main) {
        data = data_main.filter(function (d) {
            return d.statcode == "age0_3" & d.isstate == 1;
        })
        var yearSelect = "y2013";

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
gridmap();