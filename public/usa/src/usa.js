

// App needs refactoring to manage topojson
// future action

// visual of final project
//http://bl.ocks.org/bdilday/6acade5e35afa64f148d

// tutorial on creating totpjson file -- using topojson geo data and states.csv
//https://bost.ocks.org/mike/map/


// Generate a unique token for accessing backend server.
  let token = localStorage.token
  if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

 const headers = {
   'Authorization': token
 }


var vbose=0;
var width = 800,
    height = 600;
var dx = 300;
var dy = 100;
var mnyear = 1787;
var mxyear = 1975;
var animateInterval = 300 // milliseconds
var startOpacity = 0.00;
var nyear = 8.0;


var projection = d3.geo.orthographic()
    .scale(500)
    .translate([width / 2, height / 2])
    .rotate([110, -30])
    .clipAngle(90);



var projection = d3.geo.stereographic()
    .scale(800)
    .translate([width / 2, height / 2])
    .rotate([100, -40])
    .clipAngle(90);



var projection = d3.geo.mercator()
    .center([120, 50 ])
    .scale(200)
    .rotate([-180,0]);



var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var lam = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var psi = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

var g = svg.append("g");

var lam = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var psi = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

//////////////////////////////
$.ajax({
  url: "/api/getstates",
  headers: headers,
  type: "GET",
  dataType: "json"})
  .done(function(us) {
    console.log("API CALL FINISHED")
    console.log(us)


///////////////////////
//d3.json("us_stateYear.json", function(error, us) {

//    if (error) return console.error(error);

    if (vbose>=2) {
	     console.log(us);
     }


    g.selectAll("text")
	     .data([mnyear])
	     .enter()
	     .append("text")
	     .attr("x", 375)
	     .attr("y", 145)
	     .text(function(d) {
	        console.log(["text", d]);
	         return d;
	      })
	     .attr("font-family", "sans-serif")
	     .attr("font-size", "20px")
      .attr("fill", "#555")
    ;


    var land = g.selectAll("path")
	     .data(topojson.feature(us, us.objects.us_40).features)
	     .enter()
	     .append("path")
	     .attr("class", "land")
	     .attr("d", path)
       .style("fill", function(d) {
	     console.log(["fill", d]);
	     return d.properties["year"]<=mnyear ? "#555" : "#555";
	    })
	    .style("opacity", 0.0)
     ;


    g.append("path")
	     .datum(topojson.mesh(us, us.objects.us_40, function(a, b)
			     {
				 return a !== b;
			     }
			    ))
	    .attr("class", "border")
	    .attr("d", path)
	    .style("opacity", startOpacity);

  var grid = d3.geo.graticule();

    g.append("path")
        .datum(d3.geo.graticule())
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "#000000")
        .style("stroke-width", "0.5px")
	      .style("opacity", 0.1);

  var color = d3.scale.category20();
    console.log(["color", color]);

  var ic = 0;

    setInterval(function () {
	    thisyear = ic + 1787
	   console.log(["ic", ic, thisyear]);

	g.selectAll(".land")
	    .transition()
	    .duration(100)
	    .style("opacity", function(d) {
		     var y = d.properties["year"];
		     var op = (y-thisyear)*(-1.0/nyear) + 1 ;
		    if (op>1) {
		       op = 1;
		       }
		    if (op<startOpacity) {
		       op=startOpacity;
		       }
		  return op;

	    })


	g.selectAll("text")
	    .text(thisyear)
	    ;

	ic += 1;
	ic = ic % (mxyear+1-mnyear);
    }, animateInterval)
})

/**
**/
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform",
	       "translate(" +
	       d3.event.translate.join(",") +
	       ")scale(" +
	       d3.event.scale+
	       ")"
	      );

  });

svg.call(zoom)
