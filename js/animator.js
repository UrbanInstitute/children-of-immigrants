//map animation over years
function animator() {

    var last_layer;

    var control = document.getElementById('layers');

    // Add a play button div
    var play_button = control.appendChild(document.createElement('a'))
    play_button.className = "play";
    //var pause = "&#9616;&#9616;";
    //var play = "&#9654;";
    play_button.innerHTML = "";
    play_button.id = "play_button";
    play_button.onclick = function () {
        if (nextInterval) {
            nextInterval = clearInterval(nextInterval);
            play_button.className = "play";
        } else {
            //highlightLayer(i++);
            nextInterval = animate();
            play_button.className = "pause";
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
     }, {
        name: "'14",
        id: "y2014"
     }, {
        name: "'15",
        id: "y2015"
     }, {
        name: "'16",
        id: "y2016"
     }, {
        name: "'17",
        id: "y2017"
     }, {
        name: "'18",
        id: "y2018"
     }, {
        name: "'19",
        id: "y2019"
     }, {
         name: "'20",
         id: "y2020"
     }, {
         name: "'21",
         id: "y2021"
     }, {
        name: "'22",
        id: "y2022"
    }];

    layers.forEach(function (layer, n) {

        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.id = layers[n].id;
        layer.button.onclick = function () {
            highlightLayer(n);
            i = n;
            dispatch.yearChange(layer.button.id);
            nextInterval = clearInterval(nextInterval);
            play_button.className = "play";
        };
    });

    // starting layer: most recent year
    var i = layers.length - 1;

    // show the first overlay as soon as the map loads
    highlightLayer(i++);

    var nextInterval;

    function animate() {
        // and then time the next() function to run every 1 seconds
        return setInterval(function () {
            if (++i > layers.length-1) {
                i = 0;
                //console.log("zerod");
            }
            highlightLayer(i);
            //console.log(i);
        }, 1000 * 1);
    }

    function highlightLayer(i) {
        var active = control.getElementsByClassName('active');
        for (var j = 0; j < active.length; j++) active[j].className = '';

        if (layers[i] == undefined) {
            console.log("yo");
            layers[i] = layers[0];
        }
        layers[i].button.className = 'active';
        dispatch.yearChange(layers[i].id);
    }
}
animator();