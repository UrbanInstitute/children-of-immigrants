//map animation over years
function animater() {

    var last_layer;

    var control = document.getElementById('layers');

    // Add a play button div
    var play_button = control.appendChild(document.createElement('a'))
    var pause = "&#9616;&#9616;";
    var play = "&#9654;";
    play_button.innerHTML = play;
    play_button.id = "play_button";
    play_button.onclick = function () {
        if (nextInterval) {
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        } else {
            highlightLayer(i++);
            nextInterval = animate();
            play_button.innerHTML = pause;
        }
    }

    var layers = [{
        name: "'06",
        id: "y2006"
     }, {
        name: "'07",
        id: "y2007"
     }, {
        name: "'08",
        id: "y2008"
     }, {
        name: "'09",
        id: "y2009"
     }, {
        name: "'10",
        id: "y2010"
     }, {
        name: "'11",
        id: "y2011"
     }, {
        name: "'12",
        id: "y2012"
     }, {
        name: "'13",
        id: "y2013"
     }];


    layers.forEach(function (layer, n) {

        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.id = layers[n].id;
        layer.button.onclick = function () {
            highlightLayer(n);
            i = n;
            yearSelect = layer.button.id;
            dispatch.yearChange();
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        };
    });

    // we use a layer group to make it simple to remove an existing overlay
    // and add a new one in the same line of code, as below, without juggling
    // temporary variables.
    //var layerGroup = L.layerGroup().addTo(map);

    // i is the number of the currently-selected layer
    var i = 3;

    // show the first overlay as soon as the map loads
    highlightLayer(i++);

    var nextInterval;

    function animate() {
        // and then time the next() function to run every 1 seconds
        return setInterval(function () {
            highlightLayer(i);
            if (++i >= layers.length) i = 0;
        }, 1000 * 1);

    }

    function highlightLayer(i) {
        var active = control.getElementsByClassName('active');
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';
    }
}
animater();

//map - option for state or metro view
function cbsamap(div) {

    outcomeSelect = d3.select("#outcome-select").property("value");

    data = data_main.filter(function (d) {
        return d.statcode == outcomeSelect;
    })

    data.forEach(function (d) {
        d.fips = +d.fips;
        VALUE[d.fips] = +d[yearSelect];
    });

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

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
            .data(topojson.feature(us, us.objects.tl_2015_us_cbsa).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function (d) {
                return "m" + d.id;
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
            .attr("id", function (d) {
                return "m" + d.id;
            })
            .attr("class", "statemap")
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
}