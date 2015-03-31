//This code is derived from Nathan Yau's Life Expectancy visualization: http://projects.flowingdata.com/life-expectancy/
var w = 500,
    h = 385,
    margin = 30,
    startYear = 2006,
    endYear = 2012,
    startPer = 00,
    endPer = 20,
    y = d3.scale.linear().domain([endPer, startPer]).range([0 +
        margin, h - margin
    ]),
    x = d3.scale.linear().domain([2006, 2011]).range([0 + margin - 5,
        w - 20
    ]),
    years = d3.range(startYear, endYear),
    selectedYear = 2006;
selectedCat = "Population";
selectedStat = "perChange";




var groupCode, statCode, stat, stateMetro;



    var vis = d3.select("#vis")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("margin-right", "30px")
        .append("svg:g");
    //.attr("transform", "translate(-10, 0)");

    getData();

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function (d, i) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.y);
        });



    var startEnd = {},
        stateCodes = {};
    d3.text('life-expectancy-cleaned-all.csv', 'text/csv', function (
        text) {
        var states = d3.csv.parseRows(text);
        //console.log("states = " + states);
		
		drawLines(states);


        ///////			selectUS line	  
        var USClass = d3.select("#vis #US").attr("class");
        d3.select("#vis #US")
            .attr("class", USClass + " USLine")
            .moveToFront();
        ///////					  

        var interval;

        shadeMap(selectedYear, states, selectedCat, selectedStat); //initial map shade
        $('#buttons').click(function (e) {
            clearInterval(interval);
            if ($(e.target).hasClass('years')) {;
                var thisBtn = $(e.target).attr('id');
                currentYear = thisBtn;
                selectedYear = thisBtn;
                shadeMap(selectedYear, states); //shade after year button click
            }
        })

        $('#play').click(function (e) {

            if (selectedYear <= endYear) {
                var interval = setInterval(function () {
                    selectedYear++;
                    shadeMap(selectedYear, states);
                    if (selectedYear >= endYear - 1)
                        clearInterval(interval);
                }, 1000);
            }
        })
        $('#stop').click(function (e) {
            clearInterval(interval);
        })


    });




function drawLines(states){
	vis.selectAll("path").data([]).exit().remove();
	var max, min = 0;
	
	for (i = 1; i < states.length; i++) {
		var values = states[i].slice(2, states[i.length - 1]);
		var currData = [];
		stateCodes[states[i][1]] = states[i][0];
	
		var started = false;
		for (j = 0; j < values.length; j++) {
			if (values[j] != '') {
				currData.push({
					x: years[j],
					y: values[j]
				});
	
				if (!started) {
					startEnd[states[i][1]] = {
						'startYear': years[j],
						'startVal': values[j]
					};
					started = true;
				} else if (j == values.length - 1) {
					startEnd[states[i][1]]['endYear'] = years[
						j];
					startEnd[states[i][1]]['endVal'] = values[
						j];
				}
	
			}
		}
		vis.append("svg:path")
			.data([currData])
			.attr("id", states[i][1])
			.attr("d", line)
			.on("mouseover", onmouseover)
			.on("mouseout", onmouseout);
			
			    vis.append("svg:line")
        .attr("x1", x(2006))
        .attr("y1", y(startPer))
        .attr("x2", x(2011))
        .attr("y2", y(startPer))
        .attr("class", "axis")

    vis.append("svg:line")
        .attr("x1", x(startYear))
    //.attr("y1", y(startPer))
    .attr("x2", x(startYear))
    //.attr("y2", y(endPer))
    .attr("class", "axis")

    vis.selectAll(".xLabel")
        .data(x.ticks(5))
        .enter().append("svg:text")
        .attr("class", "xLabel")
        .text(String)
        .attr("x", function (d) {
            return x(d)
        })
        .attr("y", h - 10)
        .attr("text-anchor", "middle")

    vis.selectAll(".yLabel")
        .data(y.ticks(4))
        .enter().append("svg:text")
        .attr("class", "yLabel")
        .text(String)
        .attr("x", 0)
        .attr("y", function (d) {
            return y(d)
        })
        .attr("text-anchor", "right")
        .attr("dy", 3)

    vis.selectAll(".xTicks")
        .data(x.ticks(5))
        .enter().append("svg:line")
        .attr("class", "xTicks")
        .attr("x1", function (d) {
            return x(d);
        })
        .attr("y1", y(startPer))
        .attr("x2", function (d) {
            return x(d);
        })
        .attr("y2", y(startPer) + 7)

    vis.selectAll(".yTicks")
        .data(y.ticks(4))
        .enter().append("svg:line")
        .attr("class", "yTicks")
        .attr("y1", function (d) {
            return y(d);
        })
        .attr("x1", x(2005.95))
        .attr("y2", function (d) {
            return y(d);
        })
        .attr("x2", x(2006))
	}
}

function onclick(d, i) {
    var currClass = d3.select(this).attr("class");
    if (d3.select(this).classed('selected')) {
        d3.select(this).attr("class", currClass.substring(0,
            currClass.length - 9));
    } else {
        d3.select(this).classed('selected', true);
    }
}

function onmouseover(d, i) {
    //console.log(this);
    var currClass = d3.select(this).attr("class");
    var USClass = d3.select("#vis #US").attr("class");
    d3.select("#vis #US") //always keep US line darker
    .attr("class", USClass + " USLine")
        .moveToFront();
    d3.select(this)
        .attr("class", currClass + " current")
        .moveToFront();


}

function onmouseout(d, i) {
    var USClass = d3.select("#vis #US").attr("class");
    d3.select("#vis #US") //always keep US line darker
    .attr("class", USClass + " USLine")
        .moveToFront();
    var currClass = d3.select(this).attr("class");
    var prevClass = currClass.substring(0, currClass.length - 8);
    d3.select(this)
        .attr("class", prevClass);
}


function shadeMap(currentYear, dataArray, category, stat) {
    ///currentYear is the selected year
    ///dataArray is the array of all the data
    ///category is the selected category
    ///stat is the selected stat


    //$('#explainerHead'.html(stat));

    //color the button
    for (var buttonYear = 2006; buttonYear <= 2011; buttonYear++) {
        if (buttonYear != currentYear) {
            $('#' + buttonYear).css({
                backgroundColor: "#eeeeee"
            });
        } else {
            $('#' + currentYear).css({
                backgroundColor: "#fff"
            });
        }
    }
    //color the map
    $('#thisYearText').html(currentYear);
    for (k = 0; k <= dataArray[0].length; k++) {
        if (dataArray[0][k] == currentYear) {
            for (i = 0; i < dataArray.length; i++) { //getting location of ID in first array
                if (dataArray[i][k] <= 5) {
                    var thisColor = '#F1EEF6';
                } else if (dataArray[i][k] < 10) {
                    var thisColor = '#BDC9E1';
                } else if (dataArray[i][k] < 15) {
                    var thisColor = '#74A9CF';
                } else if (dataArray[i][k] < 20) {
                    var thisColor = '#2B8CBE';
                } else if (dataArray[i][k] < 25) {
                    var thisColor = '#045A8D';
                } else if (dataArray[i][k] >= 25) {
                    var thisColor = '#002244';
                }
                $('#' + dataArray[i][1]).css({
                    fill: thisColor
                });
                $('#selected_' + dataArray[i][1]).hide();

            }
        }
    }

    d3.select("#vis #currentYearLine")
        .remove();

    vis.append("svg:line")
        .attr("x1", x(currentYear))
        .attr("y1", y(startPer))
        .attr("x2", x(currentYear))
        .attr("y2", y(endPer))
        .attr("class", "linecurrentYear")
        .attr("id", "currentYearLine")
        .style("stroke-dasharray", ("3, 3"))

    $('path')
        .mouseover(function (e) { //pass in event object
            //every time, initialize thisID and thisLine
            var thisID, thisLine = null;
            var selectedState;

            var thisID = $(e.target).attr('id');
            var thisLine = $(e.target).attr('state');
            var isLineChart = this.parentNode.parentNode.parentNode;
            if (isLineChart.id == "vis") {
                var isVis = true;
            } else {
                var isVis = false;
            }
            for (k = 0; k <= dataArray[0].length; k++) {
                if (dataArray[0][k] == currentYear) {
                    var thisYear = k;
                    break;
                }
            }
            for (i = 0; i < dataArray.length; i++) { //getting location of ID in first array
                if (thisID == dataArray[i][1]) {

                    $('#mapPopup').show(); //show the popup
                    $('#mapPopup').css({
                        top: e.pageY - 65 + 'px',
                        left: e.pageX - 145 + 'px'
                    });
                    var thisIndex = i; //location of ID]
                    var dataValue = dataArray[thisIndex][thisYear];
                    $('#currentState').html('<b>' + dataArray[
                        thisIndex][0]);
                    $('#currentYear').html('<b>' + currentYear +
                        '</b>');
                    $('#currentVar').html(
                        'Share of Children of immigrants who are not citizens'
                    );
                    $('#currentValue').html('<b>' + dataValue +
                        '%</b>');
                    $('#selected_' + dataArray[thisIndex][1]).show();
                    selectedState = 'selected_' + dataArray[
                        thisIndex][1];
                    var stateAbbr = dataArray[thisIndex][1];

                    ///////			when mousing over state on map, also highlight state in lower chart	  
                    var currClass = d3.select("#vis #" +
                        stateAbbr).attr("class");
                    d3.select("#vis #" + stateAbbr)
                        .attr("class", currClass + " current")
                        .moveToFront();
                    ///////					  
                    break;
                }
            }
            if (isVis == true) { //on the line
                var thisChartIndex = i; //location of ID
                $('#chartPopup').show(); //show the popup
                $('#mapPopup').hide(); //hide the map popup						
                $('#chartPopup').css({
                    top: e.pageY - 65 + 'px',
                    left: e.pageX - 145 + 'px'
                });
                $('#currentChartState').html('<b>' + dataArray[
                    thisChartIndex][0]);
                $('#value06').html('<b>' + dataArray[
                        thisChartIndex]
                    [2] + '%');
                $('#value07').html('<b>' + dataArray[
                        thisChartIndex]
                    [3] + '%');
                $('#value08').html('<b>' + dataArray[
                        thisChartIndex]
                    [4] + '%');
                $('#value09').html('<b>' + dataArray[
                        thisChartIndex]
                    [5] + '%');
                $('#value10').html('<b>' + dataArray[
                        thisChartIndex]
                    [6] + '%');
                $('#value11').html('<b>' + dataArray[
                        thisChartIndex]
                    [7] + '%');
            }




            $(e.target).mousemove(function (e) {
                $('#mapPopup').css({
                    top: e.pageY - 65 + 'px',
                    left: e.pageX - 185 + 'px',
                });
                $('#chartPopup').css({
                    top: e.pageY - 65 + 'px',
                    left: e.pageX - 185 + 'px',
                });
            })
        })
        .mouseout(function () {
            $('#mapPopup').hide(); //hide the popup
            $('#chartPopup').hide(); //hide the popup
            for (k = 0; k <= dataArray[0].length; k++) {
                if (dataArray[0][k] == currentYear) {
                    for (i = 1; i < dataArray.length; i++) { //getting location of ID in first array
                        $('#selected_' + dataArray[i][1]).hide();
                        var stateAbbr = dataArray[i][1]
                        var currClass = d3.select("#vis #" +
                            stateAbbr).attr("class");
                        if (currClass != null) {
                            var prevClass = currClass.substring(0,
                                currClass.length - 8);
                            d3.selectAll("#vis #" + stateAbbr)
                                .attr("class", prevClass);
                            var USClass = d3.select("#vis #US").attr(
                                "class");
                            d3.select("#vis #US") //always keep US line darker
                            .attr("class", " USLine")
                                .moveToFront();
                        }
                    }
                }
            }


        });
}


function shadeMap2(currentYear, data) {
    ///currentYear is the selected year
    ///data is the array of all the data

    //console.log(data);
    //console.log(selectedStat);


    //$('#explainerHead'.html(stat));

    //color the button
    for (var buttonYear = 2006; buttonYear <= 2011; buttonYear++) {
        if (buttonYear != currentYear) {
            $('#' + buttonYear).css({
                backgroundColor: "#eeeeee"
            });
        } else {
            $('#' + currentYear).css({
                backgroundColor: "#fff"
            });
        }
    }
    //color the map
    $('#thisYearText').html(currentYear);
    for (k = 0; k <= data[0].length; k++) {
        if (data[0][k] == currentYear) {
            for (i = 0; i < data.length; i++) { //getting location of ID in first array
                if (data[i][k] <= 5) {
                    var thisColor = '#F1EEF6';
                } else if (data[i][k] < 10) {
                    var thisColor = '#BDC9E1';
                } else if (data[i][k] < 15) {
                    var thisColor = '#74A9CF';
                } else if (data[i][k] < 20) {
                    var thisColor = '#2B8CBE';
                } else if (data[i][k] < 25) {
                    var thisColor = '#045A8D';
                } else if (data[i][k] >= 25) {
                    var thisColor = '#002244';
                }
                $('#' + data[i][1]).css({
                    fill: thisColor
                });
                $('#selected_' + data[i][1]).hide();

            }
        }
    }

    d3.select("#vis #currentYearLine")
        .remove();

    vis.append("svg:line")
        .attr("x1", x(currentYear))
        .attr("y1", y(startPer))
        .attr("x2", x(currentYear))
        .attr("y2", y(endPer))
        .attr("class", "linecurrentYear")
        .attr("id", "currentYearLine")
        .style("stroke-dasharray", ("3, 3"))

    $('path')
        .mouseover(function (e) { //pass in event object
            //every time, initialize thisID and thisLine
            var thisID, thisLine = null;
            var selectedState;

            var thisID = $(e.target).attr('id');
            var thisLine = $(e.target).attr('state');
            var isLineChart = this.parentNode.parentNode.parentNode;
            if (isLineChart.id == "vis") {
                var isVis = true;
            } else {
                var isVis = false;
            }
            for (k = 0; k <= data[0].length; k++) {
                if (data[0][k] == currentYear) {
                    var thisYear = k;
                    break;
                }
            }
            for (i = 0; i < data.length; i++) { //getting location of ID in first array
                if (thisID == data[i][1]) {

                    $('#mapPopup').show(); //show the popup
                    $('#mapPopup').css({
                        top: e.pageY - 65 + 'px',
                        left: e.pageX - 145 + 'px'
                    });
                    var thisIndex = i; //location of ID]
                    var dataValue = data[thisIndex][thisYear];
                    $('#currentState').html('<b>' + data[
                        thisIndex][0]);
                    $('#currentYear').html('<b>' + currentYear +
                        '</b>');
                    $('#currentVar').html(
                        'Share of Children of immigrants who are not citizens'
                    );
                    $('#currentValue').html('<b>' + dataValue +
                        '%</b>');
                    $('#selected_' + data[thisIndex][1]).show();
                    selectedState = 'selected_' + data[
                        thisIndex][1];
                    var stateAbbr = data[thisIndex][1];

                    ///////			when mousing over state on map, also highlight state in lower chart	  
                    var currClass = d3.select("#vis #" +
                        stateAbbr).attr("class");
                    d3.select("#vis #" + stateAbbr)
                        .attr("class", currClass + " current")
                        .moveToFront();
                    ///////					  
                    break;
                }
            }
            if (isVis == true) { //on the line
                var thisChartIndex = i; //location of ID
                $('#chartPopup').show(); //show the popup
                $('#mapPopup').hide(); //hide the map popup						
                $('#chartPopup').css({
                    top: e.pageY - 65 + 'px',
                    left: e.pageX - 145 + 'px'
                });
                $('#currentChartState').html('<b>' + data[
                    thisChartIndex][0]);
                $('#value06').html('<b>' + data[
                        thisChartIndex]
                    [2] + '%');
                $('#value07').html('<b>' + data[
                        thisChartIndex]
                    [3] + '%');
                $('#value08').html('<b>' + data[
                        thisChartIndex]
                    [4] + '%');
                $('#value09').html('<b>' + data[
                        thisChartIndex]
                    [5] + '%');
                $('#value10').html('<b>' + data[
                        thisChartIndex]
                    [6] + '%');
                $('#value11').html('<b>' + data[
                        thisChartIndex]
                    [7] + '%');
            }




            $(e.target).mousemove(function (e) {
                $('#mapPopup').css({
                    top: e.pageY - 65 + 'px',
                    left: e.pageX - 185 + 'px',
                });
                $('#chartPopup').css({
                    top: e.pageY - 65 + 'px',
                    left: e.pageX - 185 + 'px',
                });
            })
        })
        .mouseout(function () {
            $('#mapPopup').hide(); //hide the popup
            $('#chartPopup').hide(); //hide the popup
            for (k = 0; k <= data[0].length; k++) {
                if (data[0][k] == currentYear) {
                    for (i = 1; i < data.length; i++) { //getting location of ID in first array
                        $('#selected_' + data[i][1]).hide();
                        var stateAbbr = data[i][1]
                        var currClass = d3.select("#vis #" +
                            stateAbbr).attr("class");
                        if (currClass != null) {
                            var prevClass = currClass.substring(0,
                                currClass.length - 8);
                            d3.selectAll("#vis #" + stateAbbr)
                                .attr("class", prevClass);
                            var USClass = d3.select("#vis #US").attr(
                                "class");
                            d3.select("#vis #US") //always keep US line darker
                            .attr("class", " USLine")
                                .moveToFront();
                        }
                    }
                }
            }


        });
}


function getData() {
    d3.text('sampleData.csv', 'text/csv', function (text) {
        var megaData = d3.csv.parseRows(text);
        //	console.log(megaData);
        var groupArray = [];
        var i;
        for (i = 1; i < megaData.length; i++) {
            thisGroup = megaData[i][0];
            groupArray[i] = thisGroup;
        }


        var newArr = [],
            origLen = groupArray.length,
            found,
            x, y;

        for (x = 1; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (groupArray[x] === newArr[y]) {
                    found = true;
                    break;
                }
            }
            if (!found) newArr.push(groupArray[x]);
        }
        groupArray = newArr; // groupArray contains every unique group.

        var statNameArray = [];
        var statCodeArray = [];
        var statCodes = [];

        //now find stats, create stat arrays, insert into groupArray
        for (j = 0; j < groupArray.length; j++) { //for each group type
            var statArray = [];
            var statCodeArray = [];
            for (k = 1; k < megaData.length; k++) {
                if (groupArray[j] == megaData[k][0]) {
                    statArray.push(megaData[k][2]);
                    statCodeArray.push(megaData[k][1]);
                }
            }
            statNameArray[j] = unique(statArray);
            statCodes[j] = unique(statCodeArray);


        }

        // Add the initial contents of the groupArray to the left navigation:
        // Add the initial contents of the statArray to the right navigation:
        document.getElementById('leftNav').appendChild(makeUL(
            groupArray));
        document.getElementById('rightNav').appendChild(
            makeULCustomID(
                statNameArray[0], statCodes[0]));
        $('#rightNav li').click(function (event) {
            selectedStat = this.id;

selectedData = parseData(selectedStat, megaData);
console.log(selectedData);
            shadeMap2(currentYear, selectedData);
				drawLines(selectedData);

        });



        $('#leftNav li').click(function (event) {
            selectedCat = this.id;
            //	console.log("left nave click" + statCodes);
            for (k = 0; k < groupArray.length; k++) {
                if (groupArray[k] == selectedCat) {
                    $('#rightNav').empty();
                    if (selectedCat ==
                        "Country_of_Origin_of_Parents") {
                        var thisList = document.createElement(
                            'ul');
                        var title;
                        title.appendChild(document.createTextNode(
                            "Children of Immigrants with parents from:"
                        ));
                        title.setAttribute("id",
                            "rightNavIntro");
                        thisList.appendChild(title);
                        document.getElementById('rightNav').appendChild(
                            title);
                    } else if (selectedCat != "Population") {

                        var thisList = document.createElement(
                            'ul');
                        var title = document.createElement(
                            'p');
                        title.appendChild(document.createTextNode(
                            "Children of Immigrants..."));
                        title.setAttribute("id",
                            "rightNavIntro");
                        thisList.appendChild(title);
                        document.getElementById('rightNav').appendChild(
                            title);

                    }
                    document.getElementById('rightNav').appendChild(
                        makeULCustomID(
                            statNameArray[k], statCodes[k]));

                    //special spacing considerations
                    if (selectedCat ==
                        "Country_of_Origin_of_Parents") {
                        $('#rightNav a').css({
                            paddingTop: 8 + "px",
                            paddingBottom: 8 + "px"
                        })
                    }
                    if (selectedCat ==
                        "Poverty_Income_and_Benefit_Receipt") {
                        $('#rightNav a').css({
                            paddingTop: 8 + "px",
                            paddingBottom: 8 + "px"
                        })
                    }
                    if (selectedCat ==
                        "Education") {
                        $('#rightNav a').css({
                            paddingTop: 9 + "px",
                            paddingBottom: 9 + "px"
                        })
                    }
                }
            }
            $('#rightNav li').click(function (event) {
                selectedStat = this.id;

            });
        });

    });
}

function parseData(stat, data) {
    /*
data format: 2d array. first array is list. third array is individual row:
	0: "GROUPCODE"
1: "STATCODE"
2: "STAT"
3: "ISSTATE"
4: "StateName"
5: "StateCode"
6: "2006"
7: "2007"
8: "2008"
9: "2009"
10: "2010"
11: "2011"*/

    // need to get it in the following format: StateName	StateCode	2006	2007	2008	2009	2010	2011
    var selectedData = [];
    for (i = 1; i < data.length; i++) {
		var tempArray = [];
        if (data[i][1] == stat) {
            tempArray[0] = data[i][4]; //stateName
            tempArray[1] = data[i][5]; //stateCode
            tempArray[2] = data[i][6]; //06
            tempArray[3] = data[i][7]; //07
            tempArray[4] = data[i][8]; //08
            tempArray[5] = data[i][9]; //09
            tempArray[6] = data[i][10]; //10
            tempArray[7] = data[i][11]; //11
			selectedData[i-1] = tempArray;
        }

    }


    console.log("parseData " + selectedData);




    return selectedData;
}



function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        var anchor = document.createElement('a');
        anchor.href = '#';
        cleaned = array[i].replace(/_/g, " ");
        anchor.appendChild(document.createTextNode(cleaned));
        item.setAttribute("id", array[i]);
        // Set its contents:
        item.appendChild(anchor);
        // Add it to the list:
        list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}

function makeULCustomID(array, idArray) {
    // Create the list element:
    // console.log("in custom id fn and idArray = " + idArray);
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        var anchor = document.createElement('a');
        anchor.href = '#';

        cleaned = array[i].replace(/_/g, " ");
        anchor.appendChild(document.createTextNode(cleaned));
        item.setAttribute("id", idArray[i]);
        // Set its contents:
        item.appendChild(anchor);
        // Add it to the list:
        list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}

var unique = function (origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) newArr.push(origArr[x]);
    }
    return newArr;
};