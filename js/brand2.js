
// JavaScript Document => This is the bubble chart
var selectedYear = 2012;
var selectfedBrands = [];
var selectedBrandData = [];
var selectedData = [];
var updatedData = [];
var initializeFlag = false;
var option;
var initializeBrandFlag = false;
var selected = false;

if(initializeFlag == false){
option = 0;
}


console.log('option = '+option);

d3.select("#BrandButton")
  .on("click", function(d){

    $('#Nav button').removeClass('active');
    $(this).addClass('active');

  option = 1;
   $("#BrandCharts").show();
   $("#CCRatingCharts").hide();
   $("#FuelTypeCharts").hide();
   reset();
   drawBubbleChart();
   drawLineChart();
//initializeBrandFlag = true;
if(initializeFlag == false){		
		initializeFlag = true;
		}
  });
  
d3.select("#CCButton")
  .on("click", function(d){

    $('#Nav button').removeClass('active');
    $(this).addClass('active');

  option = 2;
    $("#CCRatingCharts").show();
	$("#BrandCharts").hide();
	$("#FuelTypeCharts").hide();
	initializeBrandFlag = false;
if(initializeFlag == false){		
		initializeFlag = true;
		}
    removeBarCC();
	removeLineCC();
	dsBarChart();		
	initialLineChart();
	dsLineChart();	
  });
  
d3.select("#FuelButton")
  .on("click", function(d){

    $('#Nav button').removeClass('active');
    $(this).addClass('active');

  option = 3;
    $("#FuelTypeCharts").show();
	$("#BrandCharts").hide();
	$("#CCRatingCharts").hide();
	initializeBrandFlag = false;
			if(initializeFlag == false){		
		initializeFlag = true;
		}
  });
/*
	############# PART ONE: BAR CHART ###################
	-----------------------------------------------------
*/

function getRootPath(){
var curWwwPath=window.document.location.href;
var pathName=window.document.location.pathname;
var pos=curWwwPath.indexOf(pathName);
var localhostPaht=curWwwPath.substring(0,pos);
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
return(localhostPaht+projectName);
}

var url = getRootPath();
console.log(url);
drawBarChart1();	


function drawBarChart1() {
//Make a tooltip
var tooltipDiv3 = d3.select("#timelineBarChart").append("div")
            .attr("class", "tooltip")
			.style("opacity", 0);
			
  d3.csv("AnnualCar.csv", function(error, data){
     data.forEach(function(d) {
        d.year = +d.year;
        d.amount = +d.amount;
		
    });
	
				
	var margin = {
				"top": 10,
				"right": 10,
				"bottom": 30,
				"left": 50
			},
			width = 700,
			height = 200;

		var x = d3.scale.ordinal()
			.domain(data.map(function (d) {return d.year;}))
			.rangeRoundBands([0, width], 0);


		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {return d.amount;})])
			.range([height, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("s"));

		var svgContainer = d3.select("#timelineBarChart").append("svg")
			.attr("class", "chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom).append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.right + ")");

		svgContainer.append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate( 0," + height + ")")
			.call(xAxis)
			.style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});

		svgContainer.append("g")
			.attr("class", "yAxis").call(yAxis)
			.style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px','font-family':'sans-serif'})
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Car");

		svgContainer.selectAll(".bar").data(data).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d, i) {
			    return x(d.year);
			})
			.attr("y", function(d) {
				return y(d.amount);
			})
			.attr("width", function(){
				return x.rangeBand()-2;
			})
			.attr("height", function(d) {
				return height -y(d.amount);
			})
		.attr("fill","#8AB8E6")
		.on("mouseover", function(d) {
	     tooltipDiv3.transition()
		   .duration(100)
		   .style("opacity", 0.9);
	
		tooltipDiv3.html(d.year + "<br/>" + d.amount)
		.style("left", function(d) {return (d3.event.pageX-250 ) + "px";})
		.style("top", function(d) {return (d3.event.pageY-150) + "px";} );
		
		})
		.on("mouseout", function(d) {
		  tooltipDiv3.transition()
		   .duration(100)
		   .style("opacity", 0);
		})
		.on("click", function(d) {
		svgContainer.selectAll(".bar").style("fill", "#8AB8E6");
		selectedYear = d.year;
		//console.log(selectedYear);
		if(selectedYear != 0){
		reset();
		d3.select(this).style("fill", "#297ACC");  
		//If the BrandButton is clicked
        if(option == 1) {
		drawBubbleChart();
		drawLineChart();

        }
        if(option == 2) {
		    removeBarCC();
	removeLineCC();
	dsBarChart();		
	initialLineChart();
	dsLineChart();	
        }
        if(option == 3) {
          updateTable();
        }
         
		/*
		########Put your function here to initialize the corresponding charts
		*/
		}
		});
});


}

/*
############# PART 2-BY BRAND: BUBBLE CHART ###################
*/

//Draw the bubble chart
var diameter = 600,
    format = d3.format(",d"),
    color = d3.scale.category20();

var bubbleSvg1 = d3.select("#BubbleChart1").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
	.attr("pointer-events", "all")
	.append("g")
    .call(d3.behavior.zoom().on("zoom", redrawBubbleChart))
	.append("g");

	
var pack = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(4);
	
 
//Make a tooltip
var tooltipDiv2 = d3.select("#BubbleChart1").append("div")
            .attr("class", "tooltip")
			.style("opacity", 0);
			
function drawBubbleChart(){
//onsole.log("from draw bubble chart" + selectedYear);
//console.log("redraw", d3.event.translate, d3.event.scale);

d3.json("brand3.json", function(error, root) {
  var node = bubbleSvg1.selectAll(".node")
      .data(pack.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
	  .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  
  node.append("circle")
     //.attr("class", "circle")
      .attr("id", function(d,i) {return "c" + i;})
      .attr("r", function(d,i) { return d.r; })
	  .attr("rInit", function(d,i) {return d.r; })
	  .attr("selected", "false")
	  .on("mouseover", function(d,i){
	  if(!d.children){
		tooltipDiv2.transition()
		   .duration(100)
		   .style("opacity", 0.9);
		tooltipDiv2.html(d.className + "<br/>" + "year: " +selectedYear + "<br/>"+ "number: "+d.value)
		.style("left", function(d,i) {return (d3.event.pageX - 200) + "px";})
		.style("top", function(d,i) {return (d3.event.pageY -420) + "px";} );
		
	  var selectedCircle = d3.select("#c"+i);
	  selectedCircle.transition().duration(250)
	                .attr("r", selectedCircle.attr("rInit") * 1.05);
	  }
	  })
	  .on('mouseout', function (d,i) {
   	  tooltipDiv2.transition()
		   .duration(100)
		   .style("opacity", 0);
      // Back to original circle radius
      var selectedCircle = d3.select("#c" + i)
      selectedCircle.transition()
      .attr("r", selectedCircle.attr("rInit") );
    })
	.on("click", function(d) {
	if(d3.select(this).attr("selected") == "false"){
	    d3.select(this).style("fill", "#297ACC");
	  	selectedBrands.push(d.className);
		updateLineChart();
		d3.select(this).attr("selected", "true");
		console.log(selectedBrandData);
		}
		else {
		d3.select(this).style("fill", "#8AB8E6");
		var i = selectedBrands.indexOf(d.className);
		selectedBrands.splice(i, 1);
		resetLines();
		selected = true;
		updateLineChart();
		selected = false;
		d3.select(this).attr("selected", "false");
		console.log(selectedBrandData);
	
		}  
	  });
	  
  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
	  .style("font-size", function(d) { return Math.min(d.r/3, (d.r/2- 8) / this.getComputedTextLength() * 24) + "px"; })
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});

d3.select(self.frameElement).style("height", diameter + "px");

}	

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else if (node.year == selectedYear) classes.push({packageName: name, className: node.name, value: node.size, year: node.year});
	
  }

  recurse(null, root);
  return {children: classes};
}

function redrawBubbleChart() {
//console.log("redraw", d3.event.translate, d3.event.scale);
bubbleSvg1.attr("transform",
                "translate(" + d3.event.translate + ")"
                + " scale(" + d3.event.scale + ")");
}	


 /*
############# PART 2 BY BRAND: LINE CHART ###################
*/

//variables for the line chart
var margin = { top: 30, right: 50, bottom: 50, left: 60},
	width = 600 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var Bx = d3.time.scale().range([0, width-20]);

var By = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(Bx)
            .orient("bottom");
			
var yAxis = d3.svg.axis().scale(By)
            .orient("left");
			
// Mapping data to the line function
var line1 = d3.svg.line()
                .interpolate("linear")
                .defined(function(d) { return d.amount;})
                .x(function(d) {return Bx(d.year);})
				.y(function(d) {return By(d.amount); });
				
//Make the grid lines
function make_x_axis() {
return d3.svg.axis()
         .scale(Bx)
		 .orient("bottom")
		 .ticks(10);
}

function make_y_axis() {
return d3.svg.axis()
         .scale(By)
		 .orient("left")
		 .ticks(8);
}	


//Adds the svg canvas
var lineSvg1 = d3.select("#LineChart1")
            .append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," +
			margin.top + ")");
			
//Make a tooltip
var tooltipDiv = d3.select("#LineChart1").append("div")
            .attr("class", "tooltip")
			.style("opacity", 0);

//Make a legend with categorical data
var legendDiv = d3.select("#Legend1")
               .append("svg")
               .attr("width", 200)
               .attr("height", height)
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	

var legend = legendDiv.append("g")
                      .attr("class", "legend");
 			
function drawLineChart() {
 //Get the data
d3.csv("SH10.csv", function(error, data) {
color.domain(d3.keys(data[0]).filter(function(key) {return key != "year";}));
 
 data.forEach(function(d) {
   d.year = parseDate(d.year);
 });
 
var brands = color.domain().map(function(name){
    return {
	name: name,
	values: data.map(function(d) {
	return {year: d.year, amount: +d[name]};
	})
	};
 });
 
//if(!initializeBrandFlag){ 
  //Scale the range of the data	 
  Bx.domain(d3.extent(data, function(d) {return d.year;}));
  By.domain([0,d3.max(brands, function(b) {return d3.max(b.values, function(v) { return v.amount; }); })]);

  //Add the X Axis
lineSvg1.append("g")
   .attr("class", "xAxis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis);
   
   //Add the Y Axis
lineSvg1.append("g")
   .attr("class", "yAxis")
   .call(yAxis)
   .append("text")
   .attr("y", 6)
   .attr("dy", "0.71em")
   .style("text-anchor", "end");
   //.text("Registration Number");

   
//Draw the x Grid lines
lineSvg1.append("g")
        .attr("class", "grid")
		.attr("transform", "translate(0, " + height + ")")
		.call(make_x_axis()
		     .tickSize(-height, 0, 0)
			 .tickFormat("")
			 );
			 
//Draw the y Grid lines
lineSvg1.append("g")
        .attr("class", "grid")
		.call(make_y_axis()
		     .tickSize(-width, 0, 0)
			 .tickFormat("")
			 );
//initializeBrandFlag = true;
//}


});
}

  
function updateLineChart(){
//console.log("from update lines");
//console.log(selectedBrands);

selectedData = [];
updatedData = [];
var flag = false;

if(selected == true){
selectedBrandData = [];
}


d3.csv("SH10.csv", function(error, data) {
color.domain(d3.keys(data[0]).filter(function(key) {return key != "year";}));
 
 data.forEach(function(d) {
   d.year = parseDate(d.year);
 });
 
var brands = color.domain().map(function(name){
    return {
	name: name,
	values: data.map(function(d) {
	return {year: d.year, amount: +d[name]};
	})
	};
 });
 
var flag = false;
//console.log("before adding");
//console.log(selectedBrandData);

selectedBrandData.forEach(function(d) {
selectedData.push(d);
});

//only draw lines of the selected brands
brands.forEach(function(d) {
var temp = false;
if(selectedBrands.indexOf(d.name) != -1){
  selectedBrandData.forEach(function(b, i) {
    if(b.name == d.name){
	temp = true;
	//console.log(b.name);
	//console.log(d.name);
	}
  });
   if(temp != true){
	selectedBrandData.push(d);
	flag = true;
	}
  }
   
 });
  
if(flag == true){
 selectedBrandData.forEach(function(d) {
    if(selectedData.indexOf(d) == -1){
	updatedData.push(d);
	}
 });
 
 //console.log(updatedData);
 if(updatedData.length != 0){
   drawLines();
 }
}
 
});

}


function drawLines(){
var colorArray = ["#1f77b4","#ff7f0e", "#aec7e8", "#ffbb78", "#2ca02c", "#d62728", "#ff9896", " #98df8a", "#9467bd","#8c564b",
				" #c49c94","#e377c2", " #f7b6d2", "#ffbb78", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#9467bd", "#17becf"];

function getIndex(data){
var index = selectedBrandData.indexOf(data);
return index;
}

//console.log(index);
//Draw lines of each selected brand
//if no axis exists, create one, otherwise update italics
By.domain([0,d3.max(selectedBrandData, function(b) {return d3.max(b.values, function(v) { return v.amount; }); })]);
lineSvg1.selectAll("g.yAxis").transition().duration(750).call(yAxis);

//generate line paths
var lines = lineSvg1.selectAll(".line").data(selectedBrandData).attr("class","line");

// transition from previous paths to new paths
lines.transition().duration(750)
     .attr("d", function(d,i) {return line1(d.values)});
    // .style("stroke", colorArray[index]);
	 
// enter any new data
  lines.enter()
    .append("path")
    .attr("class","line")
    .attr("d", function(d,i) {return line1(d.values); })
    .style("stroke", function(d) {
	var idx = getIndex(d);
	return colorArray[idx];
	});

  // exit
  lines.exit()
       .remove();
	   
	   
lineSvg1.selectAll("g circle.dot").remove();

 var circles = lineSvg1.selectAll("g.lcircle")
            .data(selectedBrandData)
			.enter().append("g")
			.selectAll("circle")
            .data(function(d,i) {return d.values;})
			.attr("class", "lcircle");

  
circles.enter().insert("circle")
	   .attr("class", "dot")	  
	   .attr("cx", function(d,i) {
		 return Bx(d.year);
		})
	   .attr("cy", function(d,i) {
		return By(d.amount);
		})
		.attr("r", function(d) {
		return d.amount == 0 ? 0 : 5
		})
		.attr("fill", "white")
		.attr("fill-opacity", 0.5)
		.attr("stroke-width", 2)
       .on("mouseover", function(d,i) {
		tooltipDiv.transition()
		   .duration(100)
		   .style("opacity", 0.9);
		tooltipDiv.html(this.parentNode.__data__.name + "<br/>" +
	     d.amount)
		.style("left", (d3.event.pageX - 150) + "px")
		.style("top", (d3.event.pageY - 450) + "px");
		d3.select(this)
		  .attr("r", 8);
		})
		.on("mouseout", function(d) {
		tooltipDiv.transition()
		   .duration(100)
		   .style("opacity", 0);
		 d3.select(this)
		   .attr("r", 5);
		 		 
		});
//Draw the legend
var legends = legendDiv.selectAll("legend")
                       .data(updatedData);
			
legends.enter()
      .append('rect')
	  .attr("class", "lrect")
      .attr('x',  30)
      .attr('y', function(d){ 
      var idx = getIndex(d);
	  return idx *  30;})
      .attr('width', 12)
      .attr('height', 12)
      .style("fill", function(d) {
	var idx = getIndex(d);
	return colorArray[idx];
	});
    
	
legends.enter()
      .append("text")
	  .attr("class", "ltext")
      .attr("x", 50)
	  .attr('y', function(d){ 
      var idx = getIndex(d);
	  return idx *  30 + 10;})
     .text(function(d){ return d.name; })
	  .style("font-size", 13);
}
/*
############# PART 2 BY BRAND: RESET  ###################
*/
 
 //Remove all the lines in the line chart once updated
function resetLines(){
  //Remove line chart elements
    d3.select("#LineChart1").selectAll("path.line").remove();
	d3.select("#LineChart1").selectAll("circle.dot").remove();
	d3.select("#Legend1").selectAll(".legend rect").remove();
    d3.select("#Legend1").selectAll(".legend text").remove();
	
  }

/*
once click a new bar on the part 1 bar chart, we need to remove the previous drawings on part 2 to start to draw again
*/
 function reset() {
 //Remove line chart1 elements
     d3.select("#LineChart1").selectAll("path.line").remove();
     d3.select("#LineChart1").selectAll("circle.dot").remove();
	d3.select("#Legend1").selectAll(".legend rect").remove();
    d3.select("#Legend1").selectAll(".legend text").remove();
     d3.select("#LineChart1").selectAll(".xAxis").remove();
	 d3.select("#LineChart1").selectAll(".yAxis").remove();
//Update bubble chart elements
    d3.select("#BubbleChart1").selectAll(".node").remove();	
	bubbleSvg1.attr("transform",
                "translate(" + [75, 3.5] + ")"
                + " scale(" + 0.8 + ")");
//Update global variables
	selectedBrands = [];
	selectedBrandData = [];

 }

/*
############# PART TWO - CCRate###################
-------------------------------------------
*/

/*
################ FORMATS ##################
-------------------------------------------
*/
var 	formatAsPercentage = d3.format("%"),
		formatAsPercentage1Dec = d3.format(".1%"),
		formatAsInteger = d3.format(",");



datasetBarChart = [   
  { group: "2002", category: "<1000", measure: 26234 }, 
  { group: "2003", category: "<1000", measure: 20892 }, 
  { group: "2004", category: "<1000", measure: 14976 }, 
  { group: "2005", category: "<1000", measure: 9514 }, 
  { group: "2006", category: "<1000", measure: 7109 }, 
  { group: "2007", category: "<1000", measure: 7544 }, 
  { group: "2008", category: "<1000", measure: 7777 }, 
  { group: "2009", category: "<1000", measure: 7650 }, 
  { group: "2010", category: "<1000", measure: 7367 }, 
  { group: "2011", category: "<1000", measure: 6622 }, 
  { group: "2012", category: "<1000", measure: 6490 }, 
  { group: "2002", category: "1001~1600", measure: 241603 }, 
  { group: "2003", category: "1001~1600", measure: 238659}, 
  { group: "2004", category: "1001~1600", measure: 243663 }, 
  { group: "2005", category: "1001~1600", measure: 258373 }, 
  { group: "2006", category: "1001~1600", measure: 277522 }, 
  { group: "2007", category: "1001~1600", measure: 297394 }, 
  { group: "2008", category: "1001~1600", measure: 312367 }, 
  { group: "2009", category: "1001~1600", measure: 325418 }, 
  { group: "2010", category: "1001~1600", measure: 331246 }, 
  { group: "2011", category: "1001~1600", measure: 329957 }, 
  { group: "2012", category: "1001~1600", measure: 335409 },
  { group: "2002", category: "1601~2000", measure: 90598 }, 
  { group: "2003", category: "1601~2000", measure: 94372}, 
  { group: "2004", category: "1601~2000", measure: 99777 }, 
  { group: "2005", category: "1601~2000", measure: 105201 }, 
  { group: "2006", category: "1601~2000", measure: 114206 }, 
  { group: "2007", category: "1601~2000", measure: 125730 }, 
  { group: "2008", category: "1601~2000", measure: 138125 }, 
  { group: "2009", category: "1601~2000", measure: 146836 }, 
  { group: "2010", category: "1601~2000", measure: 153471 }, 
  { group: "2011", category: "1601~2000", measure: 157846 }, 
  { group: "2012", category: "1601~2000", measure: 162217 },  
  { group: "2002", category: "2001~3000", measure: 39778 }, 
  { group: "2003", category: "2001~3000", measure: 45041 }, 
  { group: "2004", category: "2001~3000", measure: 52371 }, 
  { group: "2005", category: "2001~3000", measure: 58257 }, 
  { group: "2006", category: "2001~3000", measure: 65332 }, 
  { group: "2007", category: "2001~3000", measure: 74202 }, 
  { group: "2008", category: "2001~3000", measure: 80415 }, 
  { group: "2009", category: "2001~3000", measure: 83774 }, 
  { group: "2010", category: "2001~3000", measure: 87986 }, 
  { group: "2011", category: "2001~3000", measure: 92432 }, 
  { group: "2012", category: "2001~3000", measure: 94712 },
  { group: "2002", category: ">3000", measure: 6061 }, 
  { group: "2003", category: ">3000", measure: 6004}, 
  { group: "2004", category: ">3000", measure: 6316 }, 
  { group: "2005", category: ">3000", measure: 6849 }, 
  { group: "2006", category: ">3000", measure: 8139 }, 
  { group: "2007", category: ">3000", measure: 9815 }, 
  { group: "2008", category: ">3000", measure: 11771 }, 
  { group: "2009", category: ">3000", measure: 13310 }, 
  { group: "2010", category: ">3000", measure: 15115 }, 
  { group: "2011", category: ">3000", measure: 16866 }, 
  { group: "2012", category: ">3000", measure: 18742 } 
  ];


function dsBarChart() {
	
//The selectedYear is a integer, 	
if(selectedYear!= null){
	var selectedYear2 = selectedYear.toString();
	}
//Push data of the selected year to ds	
	function datasetBarChartChosen(selectedYear) {
	var ds = [];
	for (x in datasetBarChart ) {
		 if(datasetBarChart [x].group==selectedYear){
		 	ds.push(datasetBarChart[x]);
		 }
		}
	return ds;
}
	
	 datasetBarChartTemp = [];
	
	 datasetBarChartTemp = datasetBarChartChosen(selectedYear2);
	
	function dsBarChartBasics() {
		var margin = {top: 30, right: 5, bottom: 20, left: 50},
		width = 400 - margin.left - margin.right,
	    height = 430 - margin.top - margin.bottom,
		barPadding = 3;
		
		return {
			margin: margin, 
			width: width, 
			height: height, 
			barPadding: barPadding
		};
	}
	
	var basics = dsBarChartBasics();
	
	var margin = basics.margin,
		width = basics.width,
	    height = basics.height,
		barPadding = basics.barPadding
		;
					
	var xScale = d3.scale.linear()
						.domain([0, 5])
						.range([0, width])
						;
						
	// Create linear y scale 
	var yScale = d3.scale.linear()
		   .domain([0, 350000])
		   .range([height, 0]);
	
	//Create SVG element
	var svg = d3.select("#part2")
			.append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .attr("id","barChartPlot");
	
	var plot = svg
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	            
	plot.selectAll("rect")
		   .data(datasetBarChartTemp)
		   .enter()
		   .append("rect")
			.attr("x", function(d, i) {
			    return xScale(i);
			})
		    .attr("width", width / 5 - barPadding)   
			.attr("y", function(d) {
			    return yScale(d.measure);
			})  
			.attr("height", function(d) {
			    return height-yScale(d.measure);
			})
			.attr("fill", "gray")
			.on("click", function(d){
				if(d.category =="<1000"){
				var active   = line1.active ? false : true,
				newOpacity = active ? 1 : 0;
				// Hide or show the elements
				d3.select("#line1").style("opacity", newOpacity);
				d3.selectAll("circle.below_1000").style("opacity", newOpacity);
				// Update whether or not the elements are active
				line1.active = active;
				if(newOpacity == 1){
				d3.select(this).style("fill","#BAE2E8");
				}else{
				d3.select(this).style("fill","gray");
				}}
			else if (d.category=="1001~1600"){
				var active   = line2.active ? false : true,
				newOpacity = active ? 1 : 0;
				d3.select("#line2").style("opacity", newOpacity);
				d3.selectAll("circle._1001_1600").style("opacity", newOpacity);
				line2.active = active;
				if(newOpacity == 1){
				d3.select(this).style("fill","rgb(189,215,231)");
				} else{
				d3.select(this).style("fill","gray");
				}}
			else if (d.category=="1601~2000"){
				var active   = line3.active ? false : true,
				newOpacity = active ? 1 : 0;
				d3.select("#line3").style("opacity", newOpacity);
				d3.selectAll("circle._1601_2000").style("opacity", newOpacity);
				line3.active = active;
				if(newOpacity == 1){
				d3.select(this).style("fill","rgb(116,169,207)");
				} else{
				d3.select(this).style("fill","gray");
				}}
			else if (d.category=="2001~3000"){
				var active   = line4.active ? false : true,
				newOpacity = active ? 1 : 0;
				d3.select("#line4").style("opacity", newOpacity);
				d3.selectAll("circle._2001_3000").style("opacity", newOpacity);
				line4.active = active;
				if(newOpacity == 1){
				d3.select(this).style("fill","rgb(43,140,190)");
				} else{
				d3.select(this).style("fill","gray");
				}}	
			else {
				var active   = line5.active ? false : true,
				newOpacity = active ? 1 : 0;
				d3.select("#line5").style("opacity", newOpacity);
				d3.selectAll("circle.above_3000").style("opacity", newOpacity);
				line5.active = active;
				if(newOpacity == 1){
				d3.select(this).style("fill","rgb(4,90,141)");
				} else{
				d3.select(this).style("fill","gray");
				}}	
				});
		
	// Add y labels to plot		
	plot.selectAll("text")
	.data(datasetBarChartTemp)
	.enter()
	.append("text")
	.text(function(d) {
			return formatAsInteger(d3.round(d.measure));
	})
	.attr("text-anchor", "middle")
	// Set x position to the left edge of each bar plus half the bar width
	.attr("x", function(d, i) {
			return (i * (width / 5)) + ((width / 5 - barPadding) / 2);
	})
	.attr("y", function(d) {
			return yScale(d.measure) + 10;
	})
	.attr("class", "yAxisCC");
	
	// Add x labels to chart		
	var xLabels = svg
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
		    ;
	
	xLabels.selectAll("text.xAxis")
		  .data(datasetBarChartTemp)
		  .enter()
		  .append("text")
		  .text(function(d) { return d.category;})
		  .attr("text-anchor", "middle")
		// Set x position to the left edge of each bar plus half the bar width
		.attr("x", function(d, i) {
			return (i * (width / 5)) + ((width /5 - barPadding) / 2-2);
				})
		  .attr("y", 15)
		  .attr("class", "xAxis")
		  .attr("style", "font-size: 9px; font-family: Helvetica, sans-serif");;		  					
}

/*
############# PART THREE - CCRate###################
-------------------------------------------
*/
	var year = ["2002","2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012"];
	var xCC = d3.scale.ordinal()
				.domain(year.map(function(d) {
					return d.substring(0, 4);}))
				.rangeRoundBands([40, width], 0);
				
	var time_axis = d3.svg.axis().scale(xCC).orient("bottom");
			
	var yCC = d3.scale.linear()
        .domain([0, 400000])
        .range([height, 10]);
		
	var count_axis = d3.svg.axis().scale(yCC).orient("left").tickFormat(d3.format("s"));	
		
//create svg of part3		
	var svgContainer3 = d3.select('#part3')
		.append('svg')
			.attr("class", "chart")
			.attr('width',550)
			.attr('height',450)
		.append('g')
			.attr('class','chart');

function dsLineChart(){
data = {
	"below_1000": [
	{"count": 26234, "time": 2002},
	{"count": 20892, "time": 2003}, 
	{"count": 14976, "time": 2004},
	{"count": 9514, "time": 2005}, 
	{"count": 7109, "time": 2006}, 
	{"count": 7544, "time": 2007}, 
	{"count": 7777, "time": 2008}, 
	{"count": 7650, "time": 2009}, 
	{"count": 7367, "time": 2010}, 
	{"count": 6622, "time": 2011}, 
	{"count": 6490, "time": 2012}], 
	"_1001_1600": [
	{"count": 241603, "time": 2002},
	{"count": 238659, "time": 2003}, 
	{"count": 243663, "time": 2004}, 
	{"count": 258373, "time": 2005}, 
	{"count": 277522, "time": 2006}, 
	{"count": 297394, "time": 2007}, 
	{"count": 312367, "time": 2008}, 
	{"count": 325418, "time": 2009}, 
	{"count": 331246, "time": 2010},
	{"count": 329957, "time": 2011}, 	
	{"count": 354409, "time": 2012}],
	"_1601_2000": [
	{"count": 90598, "time": 2002},
	{"count": 94372, "time": 2003}, 
	{"count": 99777, "time": 2004},
	{"count": 105201, "time": 2005}, 
	{"count": 114206, "time": 2006}, 
	{"count": 125730, "time": 2007}, 
	{"count": 138125, "time": 2008}, 
	{"count": 146836, "time": 2009}, 
	{"count": 153471, "time": 2010}, 
	{"count": 157846, "time": 2011}, 
	{"count": 162217, "time": 2012}],
	"_2001_3000": [
	{"count": 39778, "time": 2002},
	{"count": 45401, "time": 2003}, 
	{"count": 52371, "time": 2004},
	{"count": 58257, "time": 2005}, 
	{"count": 65332, "time": 2006}, 
	{"count": 74202, "time": 2007}, 
	{"count": 80415, "time": 2008}, 
	{"count": 83774, "time": 2009}, 
	{"count": 87986, "time": 2010}, 
	{"count": 92432, "time": 2011}, 
	{"count": 94712, "time": 2012}],
	"above_3000": [
	{"count": 6061, "time": 2002},
	{"count": 6004, "time": 2003}, 
	{"count": 6316, "time": 2004},
	{"count": 6849, "time": 2005}, 
	{"count": 8139, "time": 2006}, 
	{"count": 9815, "time": 2007}, 
	{"count": 11771, "time": 2008}, 
	{"count": 13310, "time": 2009}, 
	{"count": 15115, "time": 2010}, 
	{"count": 16866, "time": 2011}, 
	{"count": 18742, "time": 2012}]
	}
	
var tooltipDiv = d3.select("#part3").append("div")
            .attr("class", "tooltip")
			.style("opacity", 0);
	
draw(data);

function draw(data) {
   var margin = 40,
				width = 560,
				height = 410;
		
		//create circles by class
	svgContainer3.selectAll('circle.below_1000')
		.data(data.below_1000)
		.enter()
		.append("circle")
				.attr('class','below_1000')
				.style("opacity",0);
						
	svgContainer3.selectAll('circle._1001_1600')
		.data(data._1001_1600)
		.enter()
		.append('circle')
		.attr('class','_1001_1600')
		.style("opacity",0);
			
	svgContainer3.selectAll('circle._1601_2000')
		.data(data._1601_2000)
		.enter()
		.append('circle')
		.attr('class','_1601_2000')
		.style("opacity",0);
			
	svgContainer3.selectAll('circle._2001_3000')
		.data(data._2001_3000)
		.enter()
		.append('circle')
		.attr('class','_2001_3000')
		.style("opacity",0);
			
	svgContainer3.selectAll('circle.above_3000')
		.data(data.above_3000)
		.enter()
		.append('circle')
		.attr('class','above_3000')
		.style("opacity",0);
			
	svgContainer3.selectAll("circle")
		.on("mouseover", function(d) {
		
		if(this.style.opacity==1){
			tooltipDiv.transition()
			.duration(100)
			.style("opacity", 0.9);
	    d3.select(this)
		   .attr("r", 8);
	tooltipDiv.html(d.time + "<br/>" +
		d.count)
		.style("position","absolute")
		.style("left", (d3.event.pageX-125) + "px")
		.style("top", (d3.event.pageY - 400) + "px")
		.attr("r", 8);	
			}})
		.on("mouseout", function(d) {
		tooltipDiv.transition()
		   .duration(100)
		   .style("opacity", 0);
		 d3.select(this)
		   .attr("r", 5);	 		 
		});		

	//d3.selectAll("circle")
	svgContainer3.selectAll("circle")
		.attr("cy", function(d){return yCC(d.count);})
		.attr("cx", function(d){return xCC(d.time);})
		.attr("r", 5)
		.attr("transform","translate(21)");
				
	//create line chart	
	var line = d3.svg.line()
		.x(function(d){return xCC(d.time)})
		.y(function(d){return yCC(d.count)});
			
	svgContainer3.append("path")
		.attr("transform","translate(25)")
		.attr("d", line(data.below_1000))
		.attr("id", "line1")
		.style("opacity",0)
		.append("text")
		.text("below_1000");

	svgContainer3.append("path")
		.attr("transform","translate(25)")
		.attr("d", line(data._1001_1600))
		.attr("id", "line2")
		.style("opacity",0);

	svgContainer3.append("path")
		.attr("transform","translate(25)")
		.attr("d", line(data._1601_2000))
		.attr("id", "line3")
		.style("opacity",0);
			
	svgContainer3.append("path")
		.attr("transform","translate(25)")
		.attr("d", line(data._2001_3000))
		.attr("id", "line4")
		.style("opacity",0);
			
	svgContainer3.append("path")
		.attr("transform","translate(25)")
		.attr("d", line(data.above_3000))
		.attr("id", "line5")
		.style("opacity",0);			
	}
}

function initialLineChart(){
	//add x axis		
	svgContainer3.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(time_axis);	
	//add y axis		
	svgContainer3.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(40,0)")
		.call(count_axis);	
			
	//grid line start
	function make_x_axis() {
		return d3.svg.axis()
		.scale(xCC)
		.orient("bottom")
		.ticks(11);
	}

	function make_y_axis() {
		return d3.svg.axis()
         .scale(yCC)
		 .orient("left")
		 .ticks(7);
	}	

	svgContainer3.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
    );
		
	svgContainer3.append("g")  
		.attr("transform","translate(40,0)")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
    );
		//grid line end
}

function removeBarCC(){
	$("#part2").html("");
}

function removeLineCC(){
	d3.select("#part3").selectAll("circle").style("opacity",0);
	d3.select("#part3").selectAll("#line1").style("opacity",0);
	d3.select("#part3").selectAll("#line2").style("opacity",0);
	d3.select("#part3").selectAll("#line3").style("opacity",0);
	d3.select("#part3").selectAll("#line4").style("opacity",0);
	d3.select("#part3").selectAll("#line5").style("opacity",0);
}




//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// FUEL TYPE ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

/***
fuel type charts here... 
1. function datasetBarChartChosen, returns an object with property that includes group: year 
2. function tableCreate display value of data for specified year (from 1)
3. display line chart accordingly with dynamic axis 
***/

var datasetFuelType = {
        "Petrol": [
            {"count": 404242, "time": 2002},
            {"count": 405290, "time": 2003},
            {"count": 417074, "time": 2004},
            {"count": 438160, "time": 2005},
            {"count": 471707, "time": 2006},
            {"count": 513375, "time": 2007},
            {"count": 545994, "time": 2008},
            {"count": 589034, "time": 2009},
            {"count": 589034, "time": 2010},
            {"count": 596947, "time": 2011},
            {"count": 609792, "time": 2012}],
        "Diesel": [
            {"count": 17, "time": 2002},
            {"count": 17, "time": 2003},
            {"count": 8, "time": 2004},
            {"count": 8, "time": 2005},
            {"count": 7, "time": 2006},
            {"count": 4, "time": 2007},
            {"count": 17, "time": 2008},
            {"count": 43, "time": 2009},
            {"count": 138, "time": 2010},
            {"count": 346, "time": 2011},
            {"count": 681, "time": 2012}],
        "PetrolElectric": [
            {"count": 14, "time": 2002},
            {"count": 19, "time": 2003},
            {"count": 19, "time": 2004},
            {"count": 24, "time": 2005},
            {"count": 379, "time": 2006},
            {"count": 1057, "time": 2007},
            {"count": 1999, "time": 2008},
            {"count": 2637, "time": 2009},
            {"count": 3305, "time": 2010},
            {"count": 3786, "time": 2011},
            {"count": 4684, "time": 2012}],
        "PetrolCNG": [
            {"count": 1, "time": 2002},
            {"count": 1, "time": 2003},
            {"count": 1, "time": 2004},
            {"count": 214, "time": 2005},
            {"count": 248, "time": 2006},
            {"count": 2440, "time": 2007},
            {"count": 2678, "time": 2008},
            {"count": 2706, "time": 2009},
            {"count": 2706, "time": 2010},
            {"count": 2642, "time": 2011},
            {"count": 2410, "time": 2012}],
        "CNG": [
            {"count": 0, "time": 2002},
            {"count": 0, "time": 2003},
            {"count": 0, "time": 2004},
            {"count": 0, "time": 2005},
            {"count": 0, "time": 2006},
            {"count": 0, "time": 2007},
            {"count": 4, "time": 2008},
            {"count": 4, "time": 2009},
            {"count": 4, "time": 2010},
            {"count": 4, "time": 2011},
            {"count": 4, "time": 2012}],
        "Electric": [
            {"count": 1, "time": 2002},
            {"count": 1, "time": 2003},
            {"count": 1, "time": 2004},
            {"count": 1, "time": 2005},
            {"count": 1, "time": 2006},
            {"count": 1, "time": 2007},
            {"count": 1, "time": 2008},
            {"count": 1, "time": 2009},
            {"count": 2, "time": 2010},
            {"count": 2, "time": 2011},
            {"count": 3, "time": 2012}]
};

// get fuel type categories
function getFuelTypeCategories() {
  var categories = [];
  for (x in datasetFuelType) {
    categories.push(x);
  }
  return categories;
}

//get data of the selected year
function getDatasetFuelTypeChosen(selectedTime) {
  var ds = {};
  var categories = getFuelTypeCategories();
  for (i in categories) {
    var eachCategory = categories[i];
    var filteredElements = $.grep(datasetFuelType[eachCategory], function(n,i) {
      return n.time == selectedTime;
    });
    ds[eachCategory] = $.merge([], filteredElements);
  }
  return ds;
}

// global vars primarily used by function createFuelTypeTable()
var FUEL_TYPE_TABLE_ID = 'fuelTypeTable';
var FUEL_TYPE_TABLE_PLACEHOLER_ID = 'Table3';
var categoryColors = {};

// construct fuel type table
function createFuelTypeTable() {
  var categories = getFuelTypeCategories();
  var dataset = getDatasetFuelTypeChosen(selectedYear);

  var $table = $('<table></table>');
  $table.attr('id', FUEL_TYPE_TABLE_ID);

  //add header
  var $header = $('<tr></tr>');
  $header.append( $('<th></th>').text('Fuel Type') );
  $header.append( $('<th></th>').text('Car Population') );
  $table.append($header);

  var colors = d3.scale.category10();
  for (i in categories) {
    var eachCategory = categories[i];
    categoryColors[eachCategory] = colors(i);
    var $row = $('<tr></tr>').css('color', categoryColors[eachCategory]);
    $row.append( $('<td></td>').text(eachCategory) );
    $row.append( $('<td class="text-center"></td>').text(dataset[eachCategory][0].count) );
    $table.append($row);
  }

  $('#'+FUEL_TYPE_TABLE_PLACEHOLER_ID).append($table);
}

function updateTable() {
  var dataset = getDatasetFuelTypeChosen(selectedYear);

  $('#'+FUEL_TYPE_TABLE_ID+' tr').each(function(i) {
    if(i===0) {
      return;
    }
    var $tr = $(this);
    var category = $.trim($(this).find('td:first').text());
    var newValue = dataset[category][0].count;
    $tr.find('td:eq(1)').text(newValue);
  });


}

// transforms the datasetFuelType json object to json array
// e.g. [{count:1, time: 2012, category: "Petrol"}, {count: 20, time: 2012, category: "CNG"}, {...}]
function getFuelTypesAggregatedDataset() {
  var dataset = datasetFuelType;
  var categories = getFuelTypeCategories();
  var ds = [];
  
  //extract fuel type dataset
  for(var j in categories) {
    var category = categories[j];
    var categoryDataset = dataset[category];
    for(var i in categoryDataset) {
      categoryDataset[i]['category'] = category;
    }
    ds = $.merge(ds, categoryDataset);
  }

  return ds;
}

function getSelectedFuelTypes() {
  var ds = [];
  $('#'+FUEL_TYPE_TABLE_ID+' tr:data(active)').each(function() {
    var $tr = $(this);
    var active = $tr.data('active');
    if(active) {
      var category = $.trim($(this).find('td:first').text());
      ds.push(category);
    }
  });
  return ds;
}

// get aggregated fuel type dataset for selected categories (i.e. fuel types)
function getSelectedFuelTypesAggregatedDataset() {
  var dataset = datasetFuelType;
  var ds = [];
  
  //extract selected fuel type dataset
  var categories = getSelectedFuelTypes();
  for(var x in categories) {
    var eachCategory = categories[x];
    var categoryDataset = dataset[eachCategory];
    for(var i in categoryDataset) {
      categoryDataset[i]['category'] = eachCategory;
    }
    ds = $.merge(ds, categoryDataset);
  }

  return ds;
}

// global var for svg properties
var FUEL_TYPE_SVG_PROP = {
  WIDTH: 800,
  HEIGHT: 500,
  MARGINS: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
  }
};

// define scatter plot for fuel type dataset
function intiFuelTypeScatterPlot() {
  var dataset = getSelectedFuelTypesAggregatedDataset();
  if(dataset.length === 0) {
    dataset = getFuelTypesAggregatedDataset();
  }

  var MARGINS = FUEL_TYPE_SVG_PROP.MARGINS;
  var WIDTH = FUEL_TYPE_SVG_PROP.WIDTH;
  var HEIGHT = FUEL_TYPE_SVG_PROP.HEIGHT;

  var svgFuelType = d3.select('#svgFuelType');

  var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(dataset, function(d) {
      return d.time;
    }), d3.max(dataset, function(d) {
      return d.time;
    })]);

  var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(dataset, function(d) {
      return d.count;
    }), d3.max(dataset, function(d) {
      return d.count;
    })]);

  var xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(10)
      .tickFormat(d3.format(''))
      .tickSubdivide(true);

  var yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(10)
      .tickFormat(d3.format("s"))
      .orient('left')
      .tickSubdivide(true);
 
  svgFuelType.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);
   
  svgFuelType.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);

  var circles = svgFuelType.selectAll("circle").data(dataset);
  circles
  .enter()
  .insert("circle")
  .attr("cx", function (d) { return xRange (d.time); })
  .attr("cy", function (d) { return yRange (d.count); })
  .attr("r", 6)
  .attr("class", function (d) { return d.category; })
  .style("fill", function (d) { return categoryColors[d.category]; })
  .style("opacity", 1);

  // set tooltip
  setupFuelTypeChartTooltip();


  // draw line
  var lineFunction = d3.svg.line()
    .x(function(d) { return xRange(d.time); })
    .y(function(d) { return yRange(d.count); })
    .interpolate('linear');

  var allFuelTypes = getFuelTypeCategories();
  var datasetForLine = datasetFuelType;
  for(var i in allFuelTypes) {
    var category = allFuelTypes[i];
    svgFuelType.append("svg:path")
    .attr("d", lineFunction(datasetForLine[category]))
    .attr("id", "line-"+category)
    .attr('class', 'line')
    .style('stroke', categoryColors[category])
    .style('stroke-width', 2)
    .style('fill', 'none')
    .style("opacity",1);
  }


  //grid line start
  function make_x_axis() {
    return d3.svg.axis()
      .scale(xRange)
      .orient("bottom")
      .ticks(11);
  }
  function make_y_axis() {
    return d3.svg.axis()
     .scale(yRange)
     .orient("left")
     .ticks(7);
  } 

  svgFuelType.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + HEIGHT + ")")
    .call(make_x_axis()
    .tickSize(-HEIGHT, 0, 0)
    .tickFormat("")
    );
  svgFuelType.append("g")  
    .attr("transform","translate(0,0)")
    .attr("class", "grid")
    .call(make_y_axis()
    .tickSize(-WIDTH, 0, 0)
    .tickFormat("")
    );
  //grid line end


}
// end scatter plot function

function setupFuelTypeChartTooltip() {
  var svgFuelType = d3.select('#svgFuelType');
  var circles = svgFuelType.selectAll('circle');
  var tooltip = d3.select("body")
    .append("div")
    .attr('class', 'fuelTypeChartTooltip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", "0")
    .text("tooltip");

  // set tooltip animation
  circles
    .on("mouseover", function(d) {
         tooltip
         .html(d.count+"<br />("+d.time+")")
         .style("opacity", 1)
         .style("top", (event.pageY-10)+"px")
         .style("left",(event.pageX+20)+"px");

        d3.select(this)
          .transition()
          .attr("r", 9);  
    })
    .on("mousemove", function(d) {
         tooltip
         .html(d.count+"<br />("+d.time+")")
         .style("opacity", 1)
         .style("top", (event.pageY-10)+"px")
         .style("left",(event.pageX+20)+"px"); 
    })
    .on("mouseout", function(d) {
      tooltip
        .style("opacity", 0);
    
      d3.select(this)
      .transition()
      .attr("r", 6);      
    }); 
}

function updateFuelTypeChart() {

  var dataset = getSelectedFuelTypesAggregatedDataset();
  var selectedFuelTypes = getSelectedFuelTypes();
  var allFuelTypes = getFuelTypeCategories();

  var MARGINS = FUEL_TYPE_SVG_PROP.MARGINS;
  var WIDTH = FUEL_TYPE_SVG_PROP.WIDTH;
  var HEIGHT = FUEL_TYPE_SVG_PROP.HEIGHT;

  var svgFuelType = d3.select('#svgFuelType');

  // hide circles and lines
  svgFuelType.selectAll("circle").style("opacity", 0);
  svgFuelType.selectAll("path.line").style("opacity", 0);

  if(dataset.length == 0) {
    return;
  }

  var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(dataset, function(d) {
      return d.time;
    }), d3.max(dataset, function(d) {
      return d.time;
    })]);

  var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, d3.max(dataset, function(d) {
      return d.count;
    })]);

   var yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(10)
      .tickFormat(d3.format("s"))
      .orient('left')
      .tickSubdivide(true);

    svgFuelType.transition().select('g.y.axis').call(yAxis);  

    var circles = svgFuelType.selectAll("circle")
      .data(dataset)
      .transition()
      .duration(200)
      .attr("cx", function (d) { return xRange (d.time); })
      .attr("cy", function (d) { return yRange (d.count); })
      .style("fill", function (d) { return categoryColors[d.category]; })
      .style("opacity", 1);


    var lineFunction = d3.svg.line()
      .x(function(d) { return xRange(d.time); })
      .y(function(d) { return yRange(d.count); })
      .interpolate('linear');

    var datasetForLine = datasetFuelType;
    for(var i in selectedFuelTypes) {
      var category = selectedFuelTypes[i];
      var path = svgFuelType.select("#line-"+category)
      //.transition()
      //.duration(200)
      .attr("d", lineFunction(datasetForLine[category]))
      .attr("id", "line-"+category)
      //.style('stroke', categoryColors[category])
      //.style('stroke-width', 2)
      .style('fill', 'none')
      .style("opacity",1)
      //.style("stroke-dasharray", "4,4")
      .call(transition);

    }

  function transition(path) {
    path.transition()
      .duration(300)
      .attrTween("stroke-dasharray", tweenDash)
      .each("end", function() { return false; });
  }

  function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t); };
  }

}

createFuelTypeTable();
intiFuelTypeScatterPlot();

// set up fuel type table selecting functionality
$(document).ready(function() {

  $('#'+FUEL_TYPE_TABLE_ID+' tr').on('click', function(){
    var $tr = $(this);
    var index = $tr.index();
    var category = $.trim($tr.find('td:first').text());

    var active = $tr.data('active');
    if(active === undefined){
      $tr.data('active', false);
      active = false;
    }

    //console.log(category+' is '+ active);
    $tr.data('active', !active);
    //showLine(category, !active);

    if(!active) {
      $tr.children('td').css('background-color', '#FFFFCC');
    } else {
      $tr.children('td').css('background-color', '');
    }

    updateFuelTypeChart();

  });

  // click all fuel types in the table
  $('#'+FUEL_TYPE_TABLE_ID+' tr').find('td:first').trigger( "click" );

  $('#BrandButton').trigger('click');

});

