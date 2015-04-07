//This code is derived from Nathan Yau's Life Expectancy visualization: http://projects.flowingdata.com/life-expectancy/
var w = 500,
    h = 385,

    selectedYear = 2013;
selectedCat = "Population";
selectedStat = "perChange";
var selectedData = [];


var ShareExplainer= "The share of children in each state that are children of immigrants.";
var TotalNumExplainer= "The number of children of immigrants in each state";
var PercentExplainer= "The percent of all children of immigrants in the United States living in each state";
var AfricaExplainer= "The share of children of immigrants whose parents were born in Africa";
var eAsiaExplainer= "The share of children of immigrants whose parents were born in Asia";
var europeExplainer= "The share of children of immigrants whose parents were born in Europe";
var mexicoExplainer= "The share of children of immigrants whose parents were born in Mexico";
var centralAmericaExplainer= "The share of children of immigrants whose parents were born in Central America ";
var southAmericaExplainer= "The share of children of immigrants whose parents were born in South America ";
var seAsiaExplainer= " The share of children of immigrants whose parents were born in Southeast Asia ";
var midEastExplainer= "The share of children of immigrants whose parents were born in the Middle East";
var notCitExplainer= " The share of children of immigrants who are not U.S. citizens ";
var citNotCitParExplainer= "The share of children of immigrants who are U.S. citizens with parent(s) that are not U.S. Citizens ";
var citCitParExplainer= "The share of children of immigrants who are U.S. citizens with parents that are U.S. Citizens ";
var limEngExplainer= "The share of children of immigrants who are limited English proficient";
var engProExplainer= "The share of children of immigrants who are English proficient";
var linIsoExplainer= "The share of children of immigrants who live in linguistically isolated households ";
var onelepparExplainer= "The share of children of immigrants who have at least one limited English proficient parent ";
var epparsExplainer= " The share of children of immigrants who have English proficient parents";
var noepparsExplainer= " The share of children of immigrants who have no English proficient parents";
var age0_3Explainer= "The share of children age 0 to 3 who are children of immigrants";
var age4_5Explainer= "The share of children age 4 to 5 who are children of immigrants";
var age6_12Explainer= "The share of children age 6 to 12 who are children of immigrants";
var age13_17Explainer= "The share of children age 13 to 17 who are children of immigrants";
var NIS35Explainer= "The share of children of immigrants who are 3-5 years old and not in school";
var NIS617Explainer= "The share of children of immigrants who are 6-17 years old and not in school";
var lTHSExplainer= " The share of children of immigrants with parents with less than a High School degree";
var HSExplainer= " The share of children of immigrants with parents with a High School degree";
var colExplainer= " The share of children of immigrants with parents with at least a four-year college education ";
var sParExplainer= "The share of children of immigrants who live in one-parent families";
var tParExplainer= " The share of children of immigrants who live in two-parent families ";
var onekidExplainer= "The share of children of immigrants who live in families with one child";
var twokidExplainer= "The share of children of immigrants who live in families with two children";
var threekidExplainer= "The share of children of immigrants who live in families with three children ";
var fourkidExplainer= "The share of children of immigrants who live in families with more than four children";
var pov100Explainer= "The share of children of immigrants who live in families with income below 100% of the poverty line";
var pov200Explainer= "The share of children of immigrants who live in families with income below 200% of the poverty line";
var LIWFExplainer= "The share of children of immigrants who live in low-income working families";
var homeExplainer= "The share of children of immigrants who live in households that own their home";
var workExplainer= " The share of children of immigrants who live in working families ";

var groupCode, statCode, stat, stateMetro;



var vis = d3.select("#vis")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("margin-right", "30px")
    .append("svg:g");
//.attr("transform", "translate(-10, 0)");


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




getData();

$('#buttons').click(function (e) {
    //        clearInterval(interval);
    if ($(e.target).hasClass('years')) {;
        var thisBtn = $(e.target).attr('id');
        currentYear = thisBtn;
        selectedYear = thisBtn;
        shadeMap(selectedYear, selectedData, selectedCat,
            selectedStat); //shade after year button click
    }
})




///////////////functions

function drawLines(states) {
    vis.selectAll("path").data([]).exit().remove();
    vis.selectAll(".yLabel").data([]).exit().remove();
    vis.selectAll(".yTicks").data([]).exit().remove();
    var stateMax = [];
    var stateMin = [];

    var startEnd = {},
        stateCodes = {};

    margin = 30,
    startYear = 2006,
    endYear = 2014;
    years = d3.range(startYear, endYear);


    for (i = 1; i < states.length; i++) {
        var values = states[i].slice(2, states[i.length - 1]);
        var currData = [];
        stateCodes[states[i][1]] = states[i][0];

//console.log(years)
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
            var max_of_array = Math.max.apply(Math, values);
            var min_of_array = Math.min.apply(Math, values);
            stateMax.push(max_of_array);
            stateMin.push(min_of_array);
        }

        endPer = Math.max.apply(Math, stateMax);
        startPer = Math.min.apply(Math, stateMin);
        y = d3.scale.linear().domain([endPer, startPer]).range([0 +
            margin, h - margin
        ]);

        y = d3.scale.linear().domain([endPer, startPer]).range([0 +
            margin, h - margin
        ]),
        x = d3.scale.linear().domain([2006, 2013]).range([0 + margin -
            5,
            w - 20
        ]);

    }
    for (i = 0; i < states.length; i++) {
        var values = states[i].slice(2, states[i.length - 1]);
        var currData = [];
        stateCodes[states[i][1]] = states[i][0];
	//	console.log(stateCodes);


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
            .attr("x2", x(2013))
            .attr("y2", y(startPer))
            .attr("class", "axis")
    }


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
		
	var USClass = d3.select("#vis #US").attr("class");
		d3.select("#vis #US") //always keep US line darker
		.attr("class", USClass + " USLine")
			.moveToFront();
}



function onmouseover(d, i) {
    var currClass = d3.select(this).attr("class");
    var USClass = d3.select("#vis #US").attr("class");
    d3.select("#vis #US") //always keep US line darker
    .attr("class", USClass + " USLine")
        .moveToFront();
    d3.select(this)
        .attr("class", currClass + " current")
        .moveToFront();


}
/*
function onmouseout(d, i) {
	console.log("intopMouseout");
    var USClass = d3.select("#vis #US").attr("class");
    d3.select("#vis #US") //always keep US line darker
    .attr("class", USClass + " USLine")
        .moveToFront();
    var currClass = d3.select(this).attr("class");
    var prevClass = currClass.substring(0, currClass.length - 8);
    d3.select(this)
        .attr("class", prevClass)
        .classed("current", false);

}
*/

function shadeMap(currentYear, dataArray, category, stat) {
    ///currentYear is the selected year
    ///dataArray is the array of all the data
    ///category is the selected category
    ///stat is the selected stat

    //check to see if row 0 is a header row
    if (dataArray[0][0] != "StateName") {
        headerArray = ["StateName", "StateCode", "2006", "2007",
            "2008", "2009", "2010", "2011", "2012", "2013", "2014"
        ];
        dataArray.unshift(headerArray);
        //		console.log(dataArray);

    }
//	console.log(stat);
//	$('#explainerHead').html(stat);


var shareText="From 2006 to 2009, the number of children of immigrants in the United States steadily grew from 15.7 million to 16.8 million; from 2010 to 2011 the growth stagnated increasing at one third the rate of the previous three years.  The share, however, continued to grow steadily as the number of native born children actually fell during that time period.<br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";
var coiText="From a policy perspective country of origin is particularly important; it will influence the types of language accessibility programs necessary to serve students and their parents.  While the overall distribution of country of origin of parents of children of immigrants has not changed substantially, some consistent trends are developing, for instance there has been a steady decrease in children with parents from Europe or Canada and an increase in children with parents from the Middle East & South Asia.<br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";
var citText="Because citizenship often determines eligibility for many federal programs aimed at low income families, understanding the distribution of citizenship among children of immigrants is vital for making decisions about supplemental state programs for non-citizens.  While the share of children of immigrants in the US who are not citizens has steadily declined from 14% in 2006 to 11% in 2011, the share of citizen children with noncitizen parents has grown from 30% to 33%.  Non-citizen parents are less likely to participate in programs like SNAP or TANF even when their citizen children are eligible, implying that outreach may become an important factor in ensuring this group does not fall through the social safety net. <br><br><b>Related:</b> ASPE Barriers to Immigrant access<br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";
var languageText="English proficiency of both children of immigrants and their immigrant parents is very important for language accessibility policies. Parents with limited or no English proficiency may experience difficulties navigating schools, health providers, and other public and private community institutions <a href='http://www.urban.org/' target='_blank'>(Holcomb et al. 2003).</a> While the share of children of immigrants with limited English proficiency has fallen from 19% in 2006 to 16% in 2011, the share of children of immigrants who have no English proficient parent has remained steady at around 44%.<br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";
var educationText="From 2006 to 2011 the percentage of children in each age group who are children of immigrants has increased, with the exception of the 0 to 3 years old age group, which did not change. Their participation rates in school have been increasing for both pre-school and kindergarten through high school. The share of children of immigrants with at least one parent with a college education has increased. Age statistics is the share of children that are children of immigrants in a certain age group and not the share of children of immigrants who are in a certain age group.<br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";
var familyText="Children of immigrants are much more likely to live in two parent homes than children of native-born parents. While the share of children of immigrants with single parents is increasing it is increasing very slowly.  Children of immigrants are also more likely to have a large number of siblings, with 64% of children of immigrants living in families with more than four children versus 50% of children of native born parents.<br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";
var povertyText="While there was an overall increase in the share of children below the poverty line, children of immigrants were especially affected, despite being more likely to be in families with at least one parent working.  While the share of children of immigrants living in poor families actually declined from 2006 to 2008, the share jumped from 20% in 2008 to 26% in 2011. <br><br><br>For more information please see the <a href='http://www.urban.org/publications/413113.html' target='_blank'>Children of Immigrants Brief</a>";

    //add text to left-side
	$('#trendsHead').html("Trends in " + category.replace(/_/g, " "));
			if(category == "Population"){
				$('#trendsText').html(shareText);
			}
			if(category == "Country_of_Origin_of_Parents"){
				$('#trendsText').html(coiText);
			}
            if(category == "Citizenship"){
				$('#trendsText').html(citText);
			}
			if(category == "English_Proficiency"){
				$('#trendsText').html(languageText);
			}
			if(category == "Education"){
				$('#trendsText').html(educationText);
			}
			if(category == "Family_Structure"){
				$('#trendsText').html(familyText);
			}
			if(category == "Poverty_Income_and_Benefit_Receipt"){
				$('#trendsText').html(povertyText);
			}
			
			
    //color the button
    for (var buttonYear = 2006; buttonYear <= 2013; buttonYear++) {
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

    var bucketArray = [];
    bucketArray = setBuckets(dataArray);

    //rekey the map
    var bucket1Node = document.getElementById("bucket1-2");
    if (selectedStat != "TotalNum") {
        $('#bucket1-2').text(bucketArray[1] + '%');
        $('#bucket2-3').text(bucketArray[2] + '%');
        $('#bucket3-4').text(bucketArray[3] + '%');
        $('#bucket4-5').text(bucketArray[4] + '%');
    } else {
        $('#bucket1-2').text(bucketArray[1]);
        $('#bucket2-3').text(bucketArray[2]);
        $('#bucket3-4').text(bucketArray[3]);
        $('#bucket4-5').text(bucketArray[4]);
    }
    //color the map
    $('#thisYearText').html(currentYear);
    for (k = 0; k <= dataArray[0].length; k++) {
        if (dataArray[0][k] == currentYear) {
            for (i = 0; i < dataArray.length; i++) { //getting location of ID in first array
                //init color 
                $('#' + dataArray[i][1]).css({
                    fill: '#ffffff'
                });
                if (dataArray[i][k] <= bucketArray[0]) {
                    var thisColor = '#F1EEF6';
                    var thisLabelColor = '#000000';
                } else if (dataArray[i][k] < bucketArray[1]) {
                    var thisLabelColor = '#000000';
                    var thisColor = '#BDC9E1';
                } else if (dataArray[i][k] < bucketArray[2]) {
                    var thisLabelColor = '#000000';
                    var thisColor = '#74A9CF';
                } else if (dataArray[i][k] < bucketArray[3]) {
                    var thisLabelColor = '#ffffff';
                    var thisColor = '#2B8CBE';
                } else if (dataArray[i][k] < bucketArray[4]) {
                    var thisLabelColor = '#ffffff';
                    var thisColor = '#045A8D';
                } else if (dataArray[i][k] >= bucketArray[4]) {
                    var thisColor = '#002244';
                    var thisLabelColor = '#ffffff';
                }
                if (dataArray[i][k] == null) {
                    var thisColor = '#e0e0e0';
                    var thisLabelColor = '#000';
                }


                $('#' + dataArray[i][1]).css({
                    fill: thisColor
                });
                $('#' + dataArray[i][1] + 'label').css({
                    fill: thisLabelColor
                });
                $('#selected_' + dataArray[i][1]).hide();

            }
        }
    }

    d3.select("#vis #currentYearLine")
        .remove();
    //console.log("******" + currentYear);
    startPer = 0;
    endPer = 40;
    //console.log("*startPer**" + startPer);
    /*    vis.append("svg:line")
        .attr("x1", x(currentYear))
        .attr("y1", y(startPer))
        .attr("x2", x(currentYear))
        .attr("y2", y(endPer))
        .attr("class", "linecurrentYear")
        .attr("id", "currentYearLine")
        .style("stroke-dasharray", ("3, 3"))*/


    $('path')
        .mouseover(function (e) { //pass in event object
            //every time, initialize thisID and thisLine
            var thisID, thisLine, selectedState= null;
            //var selectedState;
            var thisID = $(e.target).attr('id');
            //console.log(this.id);
            var thisLine = $(e.target).attr('state');
			
			//if browser is IE, turn all lines off
			if ($.browser.msie) { 
				  for (k = 0; k <= dataArray[0].length; k++) {
                    if (dataArray[0][k] == currentYear) {
                        for (i = 1; i < dataArray.length; i++) { //getting location of ID in first array
                            var stateAbbr = dataArray[i][1];
                            //	console.log(stateAbbr);

                            $('#selected_' + stateAbbr).hide();
                            d3.selectAll("#vis #" + stateAbbr)
                            //    .attr("class", prevClass)
                            .classed("current", false);
                            var USClass = d3.select(
                                "#vis #US").attr(
                                "class");
                            if (USClass) {
                                d3.select("#vis #US") //always keep US line darker
                                .attr("class", "USLine")
                                    .moveToFront();
                            }
                        }
                    }
                }
				 
			 }
			
            var isLineChart = this.parentNode.parentNode.parentNode;
			//console.log(isLineChart);
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
			//console.log(thisID);
            for (i = 0; i < dataArray.length; i++) { //getting location of ID in first array
                if (thisID == dataArray[i][1]) {
                    $('#mapPopup').show(); //show the popup
                    $('#mapPopup').css({
                        top: e.pageY - 60 + 'px',
                        left: e.pageX - 175 + 'px'
                    });
                    var thisIndex = i; //location of ID]
                    var dataValue = null;
					dataValue = dataArray[thisIndex][thisYear];
					//console.log(thisYear);
					//console.log(thisIndex + " " + dataValue + " || " + dataArray );
                    $('#currentState').html('<b>' + dataArray[
                        thisIndex][0]);
                    $('#currentYear').html('<b>' + currentYear +
                        '</b>');
                    if (selectedStat != "TotalNum") {
                        $('#currentValue').html('<b>' + dataValue +
                            '%</b>');
                    } else {
                        $('#currentValue').html('<b>' + addCommas(
                            dataValue) + '</b>');
                    }
                    $('#selected_' + dataArray[thisIndex][1]).show();
                    selectedState = 'selected_' + dataArray[
                        thisIndex][1];
                    var stateAbbr = dataArray[thisIndex][1];

                    ///////			when mousing over state on map, also highlight state in lower chart	  
                    var currClass = d3.select("#vis #" +
                        stateAbbr).attr("class");
                    d3.select("#vis #" + stateAbbr)
                        .attr("class", currClass + " current")
                        .each(moveToFront);
                    ///////					  
                    break;
                }
				
            }
            if (isVis == true) { //on the line
                var thisChartIndex = i; //location of ID
                $('#chartPopup').show(); //show the popup
                $('#mapPopup').hide(); //hide the map popup						
                
                if (selectedStat != "TotalNum") {
                    $('#currentChartState').html('<b>' +
                        dataArray[
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
                    $('#value12').html('<b>' + dataArray[
                            thisChartIndex]
                        [8] + '%');
                    $('#value13').html('<b>' + dataArray[
                            thisChartIndex]
                        [9] + '%');
                } else {
                    $('#currentChartState').html('<b>' +
                        dataArray[
                            thisChartIndex][0]);
                    $('#value06').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [2]));
                    $('#value07').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [3]));
                    $('#value08').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [4]));
                    $('#value09').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [5]));
                    $('#value10').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [6]));
                    $('#value11').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [7]));
                    $('#value12').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [8]));
                    $('#value13').html('<b>' + addCommas(
                        dataArray[
                            thisChartIndex]
                        [9]));
                }

            }

        })
		.mousemove(function (e) {
			var offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
			var offY  = (e.offsetY || e.clientY - $(e.target).offset().top);
		//	console.log(document.getElementById("mapPopup").offsetWidth);
                $('#mapPopup').css({
                    top: e.pageY - 60 + 'px',
                    left: e.pageX - 175 + 'px'
                });
                $('#chartPopup').css({
                    top: e.pageY - 60 + 'px',
                    left: e.pageX - 175 + 'px'
                });
                //console.log(e.offsetY);
            })
		.mouseout(function () {
                //console.log("inMousout");
                $('#mapPopup').hide(); //hide the popup
                $('#chartPopup').hide(); //hide the popup
                for (k = 0; k <= dataArray[0].length; k++) {
                    if (dataArray[0][k] == currentYear) {
                        for (i = 1; i < dataArray.length; i++) { //getting location of ID in first array
                            var stateAbbr = dataArray[i][1];
                            //	console.log(stateAbbr);

                            $('#selected_' + stateAbbr).hide();
                            d3.selectAll("#vis #" + stateAbbr)
                            //    .attr("class", prevClass)
                            .classed("current", false);
                            var USClass = d3.select(
                                "#vis #US").attr(
                                "class");
                            if (USClass) {
                                d3.select("#vis #US") //always keep US line darker
                                .attr("class", "USLine")
                                    .moveToFront();
                            }
                        }
                    }
                }
            });
			
			 





}




function getData() {
    d3.text('InteractiveMap_State2013.csv', 'text/csv', function (text) {
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
			//console.log(statCodes[j]);


        }

        //initial shade
        selectedStat = "Share";
		selectedCat = "Population";
        selectedData = parseData(selectedStat, megaData);
     //   shadeMap(selectedYear, selectedData, selectedCat, selectedStat);
        drawLines(selectedData);




        ///////			selectUS line	  
        var USClass = d3.select("#vis #US").attr("class");
        d3.select("#vis #US")
            .attr("class", USClass + " USLine")
            .moveToFront();
        ///////					  
        shadeMap(2013, selectedData, selectedCat);
        //end initial shade


        // Add the initial contents of the groupArray to the left navigation:
        // Add the initial contents of the statArray to the right navigation:
        document.getElementById('leftNav').appendChild(makeUL(
            groupArray));
        document.getElementById('rightNav').appendChild(
            makeULCustomID(
                statNameArray[0], statCodes[0]));
        //initial menu shade
        $('#Population').css({
            backgroundColor: '#fff'
        });
        $('#Share').css({
            backgroundColor: '#fff'
        });


        $('#rightNav li').click(function (event) {
            for (j = 0; j < statCodes.length; j++) {
                for (k = 0; k < statCodes[j].length; k++) {
                    $('#' + statCodes[j][k]).css({
                        background: "url('gradient.png') repeat-y top left",
                        backgroundColor: "#eeefef"
                    });
                }
            }
            selectedStat = this.id;
            $('#' + this.id).css({
                background: "url('gradientWhite.png') repeat-y top left",
                backgroundColor: "#fff"
            });
            $('#Population').css({
                backgroundColor: "#fff"
            });
            selectedData = parseData(selectedStat, megaData);
            drawLines(selectedData);
            shadeMap(selectedYear, selectedData, selectedCat,
                selectedStat);
			//	console.log(this.textContent);
              $('#explainerHead').html(this.textContent);
			  	var  explainerText = selectedStat+"Explainer";
					  $('#explainerText').html(eval(explainerText));

        });



        $('#leftNav li').click(function (event) {
            selectedCat = this.id;

            //	console.log("left nave click" + statCodes);
            for (k = 0; k < groupArray.length; k++) {
                $('#' + groupArray[k]).css({
                    backgroundColor: '#eeefef'
                });

                if (groupArray[k] == selectedCat) {
                    $('#' + selectedCat).css({
                        backgroundColor: "#fff"
                    });
                    $('#rightNav').empty();
                    if (selectedCat ==
                        "Country_of_Origin_of_Parents") {
                        var thisList = document.createElement(
                            'ul');
                        var title = document.createElement(
                            'p');

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
                            paddingTop: 6 + "px",
                            paddingBottom: 6 + "px"
                        })
                    }
                    if (selectedCat ==
                        "English_Proficiency") {
                        $('#rightNav a').css({
                            paddingTop: 7 + "px",
                            paddingBottom: 7 + "px"
                        })
                    }
                    if (selectedCat ==
                        "Poverty_Income_and_Benefit_Receipt") {
                        $('#rightNav a').css({
                            paddingTop: 10 + "px",
                            paddingBottom: 10 + "px"
                        })
                    }
                    if (selectedCat ==
                        "Family_Structure") {
                        $('#rightNav a').css({
                            paddingTop: 5 + "px",
                            paddingBottom: 5 + "px"
                        })
                    }
                    if (selectedCat ==
                        "Education") {
                        $('#rightNav a').css({
                            paddingTop: 3 + "px",
                            paddingBottom: 3 + "px",
                            fontSize: 13
                        })
                    }
                }
            }
            $('#rightNav li').click(function (event) {
                for (j = 0; j < statCodes.length; j++) {
                    for (k = 0; k < statCodes[j].length; k++) {
                        $('#' + statCodes[j][k]).css({
                            background: "url('gradient.png') repeat-y top left",
                            backgroundColor: "#eeefef"
                        });
                    }
                }
                selectedStat = this.id;
                $('#' + this.id).css({
                    background: "url('gradientWhite.png') repeat-y top left",
                    backgroundColor: "#fff"
                });
                selectedData = parseData(selectedStat,
                    megaData);
                //currentYear, dataArray, category, stat
                drawLines(selectedData);
                shadeMap(selectedYear, selectedData,
                    selectedCat, selectedStat);
					              $('#explainerHead').html(this.textContent);
								  
					var  explainerText = selectedStat+"Explainer";
					  $('#explainerText').html(eval(explainerText));

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
    var selectedDataCounter = 0;
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
            tempArray[8] = data[i][12]; //12
            tempArray[9] = data[i][13]; //13
		$('#currentVar').text(data[i][2]);
            // console.log(i);
            selectedData[selectedDataCounter] = tempArray;
            selectedDataCounter++;
        }


    }
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

function setBuckets(arr) {
    //    console.log("set buckets and arr=" + arr);
    arr2 = [];
    for (k = 1; k < arr.length; k++) {
        for (j = 2; j < arr[k].length; j++) {
            arr2.push(parseFloat(arr[k][j]));
        }
    }
    //    console.log("arr2 " + arr2);
    var minimum = arr2[0],
        maximum = arr2[0];
    for (i = 0; i < arr2.length - 1; i++) {
        // console.log("miniumum is " + minimum + " and this value is " + arr2[i] + " and maximum is " + maximum);
        if (arr2[i] < minimum) {
            minimum = arr2[i];
        }
        if (arr2[i] > maximum) {
            maximum = arr2[i];
        }

    }
    //console.log(minimum + " " + maximum);
    var roundedMin, roundedMax, range;
    range = maximum - minimum;
    //console.log(range);
    var bucketAmt;
    bucketAmt = range / 5;
    if (range > 25) { //buckets of 10
        bucketAmt = 10 * Math.round(bucketAmt / 10);
        roundedMinimum = Math.floor((minimum / 10)) * 10;
    } else if (range <= 25 & range < 5) { //buckets of 5
        bucketAmt = 5 * Math.round(bucketAmt / 5);
        roundedMinimum = Math.floor((minimum / 5)) * 5;
    } else { //buckets of 1
        bucketAmt = 1 * Math.round(bucketAmt / 1);
        roundedMinimum = Math.floor((minimum / 1)) * 1;
    }
    //console.log(bucketAmt);
    //	console.log(minimum + " and lowest bucket starts at " + roundedMinimum);
    var bucketsArray = [];
    for (t = 0; t <= 4; t++) {
        bucketsArray[t] = roundedMinimum + (bucketAmt * t);
    }
    return (bucketsArray);




}

function addCommas(nStr) {

    nStr += '';

    x = nStr.split('.');

    x1 = x[0];

    x2 = x.length > 1 ? '.' + x[1] : '';

    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {

        x1 = x1.replace(rgx, '$1' + ',' + '$2');

    }

    return x1 + x2;
}

function moveToFront() { 
    this.parentNode.appendChild(this); 
  }