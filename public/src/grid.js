
// used in matrix.html

// using d3 timer
// https://stackoverflow.com/questions/14872687/how-to-rotate-an-object-around-the-center-in-d3-js
// https://bl.ocks.org/mbostock/1353700
// http://bl.ocks.org/djvanderlaan/4953593

// deep snake https://github.com/gmamaladze/deep-snake
// dispatching events https://bl.ocks.org/mbostock/5872848

// dom to canvas https://bl.ocks.org/mbostock/1276463
// ecommerce wheel http://saranyan.github.io/commerce_wheel/
// d3 overall to google maps https://bl.ocks.org/mbostock/899711
// mouseover https://bl.ocks.org/mbostock/1087001
// periodic table nice mouseover http://tributary.io/inlet/4470504/
// streaming traffic http://bl.ocks.org/WardCunningham/5861122
// real time display of a time series https://bost.ocks.org/mike/path/
// real time bubble chart https://pubnub.github.io/d3-bubble/

function gridData() {
	var data = new Array();
	var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1;
	var width = 50;
	var height = 50;
	var click = 0;

	// iterate for rows
	for (var row = 0; row < 10; row++) {
		data.push( new Array() );

		// iterate for cells/columns inside rows
		for (var column = 0; column < 10; column++) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click
			})
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;
	}
	return data;
}

var gridData = gridData();
// I like to log the data to the console for quick debugging
console.log(gridData);

var grid = d3.select("#grid")
	.append("svg")
	.attr("width","510px")
	.attr("height","510px");

var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");

var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", "#fff")
	.style("stroke", "#222")
	.on('click', function(d) {
       d.click ++;
       if ((d.click)%4 == 0 ) { d3.select(this).style("fill","#fff"); }
	   if ((d.click)%4 == 1 ) { d3.select(this).style("fill","#2C93E8"); }
	   if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#F56C4E"); }
	   if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
    });
