
/////////////////////////////////////////////////////
////////  		spoof location services         ///////
///////  test complex messaging & geofencing ///////
//////////////////////////////////////////////////

// Generate a unique token for accessing backend server.
let token = localStorage.token
if (!token) {
    token = localStorage.token = Math.random().toString(36).substr(-8)
  }
const headers = {
   'Authorization': token
 }

// set of variables which need to be initialized
// the initialization is done inside of 'when function' in order to control async behavior
// the mapbox api token needs to be retrieved before the remaining variables are set

let mapboxToken
let mapboxTiles
let map
// we will be appending the SVG to the Leaflet map pane
let svg
// g (group) element will be inside the svg. The leaflet-zoom-hide masks original svg on zoom
let g

$.when(getConfigData(), getGeoData()).done(function(result1, result2) {
  // result1 has api key for mapboxTiles retrieved from server
  mapboxToken = result1[0]
  mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/examples.map-zr0njcqy/{z}/{x}/{y}.png?access_token={token}', {
      attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
      token: mapboxToken
  });
  map = L.map('map')
      .addLayer(mapboxTiles)
      .setView([40.72332345541449, -73.99], 14);
  //
  svg = d3.select(map.getPanes().overlayPane).append("svg");
  g = svg.append("g").attr("class", "leaflet-zoom-hide");

  // result2 has the geojson object retrieved from server
  d3Map(result2[0])

})

// retrieve geojon object which maps out the path navigated by traveler
function getGeoData() {
  return $.ajax({
    url: "/api/geopoints",
    headers: headers,
    method: "GET",
    success: function() {
      console.log("GeoJSON Data Retrieved")
      },
    error: function() {
      console.log("Error - GeoJson Data not retrieved")
      }
    })
  }

// retrieve the mapbox token - stored on server for security
function getConfigData() {
  return $.ajax({
      url: "/api/geoconfig",
      headers: headers,
      method: "GET",
      success: function() {
        console.log("Mapbox Token Retrieved")
        },
      error: function() {
        console.log("Error - MapBox Token not retrieved")
        }
      })
 }

// execute function for rendering map, simulating navigations and geofencing
function d3Map(collection) {
    // this is not needed right now, but for future we may need
    // to implement some filtering. This uses the d3 filter function
    // featuresdata is an array of point objects

    var featuresdata = collection.features.filter(function(d) {
        return d.properties.id == "route1"
    })

    //stream transform. transforms geometry before passing it to
    // listener. Can be used in conjunction with d3.geo.path
    // to implement the transform.

    var transform = d3.geo.transform({
        point: projectPoint
    });

    // d3.geo.path translates GeoJSON to SVG path codes.
    // essentially a path generator. In this case it's
    // a path generator referencing our custom "projection"
    // which is the Leaflet method latLngToLayerPoint inside
    // our function called projectPoint
    var d3path = d3.geo.path().projection(transform);


    // Here we're creating a FUNCTION to generate a line
    // from input points. Since input points will be in
    // Lat/Long they need to be converted to map units
    // with applyLatLngToLayer
    var toLine = d3.svg.line()
        .interpolate("linear")
        .x(function(d) {
            return applyLatLngToLayer(d).x
        })
        .y(function(d) {
            return applyLatLngToLayer(d).y
        });

    // From now on we are essentially appending our features to the
    // group element. We're adding a class with the line name
    // and we're making them invisible

    // these are the points that make up the path
    // they are unnecessary so I've make them
    // transparent for now
    var ptFeatures = g.selectAll("circle")
        .data(featuresdata)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("class", "waypoints");

    // Here we will make the points into a single
    // line/path. Note that we surround the featuresdata
    // with [] to tell d3 to treat all the points as a
    // single line. For now these are basically points
    // but below we set the "d" attribute using the
    // line creator function from above.
    var linePath = g.selectAll(".lineConnect")
        .data([featuresdata])
        .enter()
        .append("path")
        .attr("id", "way")
        .attr("class", "lineConnect");


    // see testlab/d3transition project -- can add .on listeners
    //    .on("mouseover", mouseover);
    // This will be our traveling circle it will
    // travel along our path
    var marker = g.append("circle")
        .attr("r", 10)
        .attr("id", "marker")
        .attr("class", "travelMarker");


    // For simplicity I hard-coded this! I'm taking
    // a set of objects (the origin, interim points and distination)
    // and adding them separately to better style them. There is probably a better
    // way to do this!
    // also - in order to calculate the paths to each interim point, ad set up a geofence
    // i am creating interim paths one ach length will be calcuated in linepath transition
    var originANDdestination = [featuresdata[0], featuresdata[8], featuresdata[12], featuresdata[17]]


    // not used in this app but following functions create 4 arrays with the
    // geojson data for each marker on the map
    let subwaydata = featuresdata.filter((item, i) => { if (i == 0) return item })
    let bookstoredata = featuresdata.filter((item, i) => { if (i < 9) return item })
    let botstoredata = featuresdata.filter((item, i) => { if (i < 13) return item })
    let officedata = featuresdata.filter((item, i) => { return item })


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    var begend = g.selectAll(".drinks")
        .data(originANDdestination)
        .enter()
        .append("circle", ".drinks")
        .attr("r", 5)
        .attr("id", "geofence")
        .style("fill", "red")
        .style("opacity", "1");

    // This tags the start and end points with names (recorded in geojson object)
    var text = g.selectAll("text")
        .data(originANDdestination)
        .enter()
        .append("text")
        .text(function(d) {
          return d.properties.name
        })
        .attr("class", "locnames")
        .attr("y", function(d) {
            return -10
        })

    // when the user zooms in or out you need to reset
    // the view
    map.on("viewreset", reset);

    // this puts stuff on the map!
    reset();
    transition();

    // Reposition the SVG to cover the features.
    function reset() {

        var bounds = d3path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];


        // here you're setting some styles, width, height etc
        // to the SVG. Note that we're adding a little height and
        // width because otherwise the bounding box would perfectly
        // cover our features BUT... since you might be using a big
        // circle to represent a 1 dimensional point, the circle
        // might get cut off.

        text.attr("transform",
            function(d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });


        // for the points we need to convert from latlong
        // to map units
        begend.attr("transform",
            function(d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });

        ptFeatures.attr("transform",
            function(d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });

        // again, not best practice, but I'm hard coding
        // the starting point

        marker.attr("transform",
            function() {
                var y = featuresdata[0].geometry.coordinates[1]
                var x = featuresdata[0].geometry.coordinates[0]

                return "translate(" +
                    map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                    map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
            });


        // Setting the size and location of the overall SVG container
        svg.attr("width", bottomRight[0] - topLeft[0] + 120)
            .attr("height", bottomRight[1] - topLeft[1] + 120)
            .style("left", topLeft[0] - 50 + "px")
            .style("top", topLeft[1] - 50 + "px");

        // this method creates the path element with the svg line calibrated
        // to the map scale --
        linePath.attr("d", toLine)

        g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

    } // end reset

    // the transition function could have been done above using
    // chaining but it's cleaner to have a separate function.
    // the transition. Dash array expects "500, 30" where
    // 500 is the length of the "dash" 30 is the length of the
    // gap. So if you had a line that is 500 long and you used
    // "500, 0" you would have a solid line. If you had "500,500"
    // you would have a 500px line followed by a 500px gap. This
    // can be manipulated by starting with a complete gap "0,500"
    // then a small line "1,500" then bigger line "2,500" and so
    // on. The values themselves ("0,500", "1,500" etc) are being
    // fed to the attrTween operator

    // NOTE - THis is the infinite loop -- keep replaying the transition
    function transition() {

       linePath.transition()
            .duration(30000)
            .attrTween("stroke-dasharray", tweenDash)
            .each("end", function() {
              d3.select(this).call(transition);  // infinite loop
            })
          } //end transition


    // this function feeds the attrTween operator above with the
    // stroke and dash lengths
    function tweenDash() {
        return function(t) {
            //total length of path (single value)
            var l = linePath.node().getTotalLength();


            // this is creating a function called interpolate which takes
            // as input a single value 0-1. The function will interpolate
            // between the numbers embedded in a string. An example might
            // be interpolatString("0,500", "500,500") in which case
            // the first number would interpolate through 0-500 and the
            // second number through 500-500 (always 500). So, then
            // if you used interpolate(0.5) you would get "250, 500"
            // when input into the attrTween above this means give me
            // a line of length 250 followed by a gap of 500. Since the
            // total line length, though is only 500 to begin with this
            // essentially says give me a line of 250px followed by a gap
            // of 250px.
            interpolate = d3.interpolateString("0," + l, l + "," + l);
            //t is fraction of time 0-1 since transition began
            var marker = d3.select("#marker");

            // p is the point on the line (coordinates) at a given length
            // along the line. In this case if l=50 and we're midway through
            // the time then this would be 25.
            var p = linePath.node().getPointAtLength(t * l);

            //Move the marker to that point
            marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker

          console.log(d3.select("#way").attr("stroke-dasharray"))
    
           let pnt = interpolate(t)
           var arr = pnt.split(",");
           var arg1 = parseInt(arr[0], 10)
           var arg2 = parseInt(arr[1], 10)
           var result = arg1/arg2
           console.log(result)

            return interpolate(t);

        }
    } //end tweenDash

    // Use Leaflet to implement a D3 geometric transformation.
    // the latLngToLayerPoint is a Leaflet conversion method:
    // Returns the map layer point that corresponds to the given geographical
    // coordinates (useful for placing overlays on the map).
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    } //end projectPoint
};

// similar to projectPoint this function converts lat/long to
// svg coordinates except that it accepts a point from our GeoJSON
// This is also the function used to detect an intersection with the geofence
// which are identified in the geojson file

function applyLatLngToLayer(d) {
    var y = d.geometry.coordinates[1]
    var x = d.geometry.coordinates[0]
    return map.latLngToLayerPoint(new L.LatLng(y, x))
}

////////////////////////////////////////////////////////////////////////
// publishes a message to redis when the geofence is intersected
function stream() {

   // set of variables used in the geofencing routine
   // geotag serves as a proxy for a wifi or gps tag, detectable by low power units
   // the geotag is registered to an individual, and enscribed with pertinent data on creation
   // additional data is appended when the tag is detected, and the message payload pub to redis

    let geotag = {
      "_id": "59822a4375dfef09ec9b6f14",
      "_tagid": "123456",
      "_vendorid": "654321",
      "__v": 0,
      "_created": new Date()
    }

    return $.ajax({
      url: "/geo/fence",
      headers: headers,
      method: "GET",
      success: function() {
        console.log("GeoFence Message Published")
        },
      error: function() {
        console.log("Error - GeoFence Message Not Published")
        }
    })

}

/////////////////mouseover test//////////////////////

function mouseover(d) {
  this.parentNode.appendChild(this);

  d3.select(this)
      .style("pointer-events", "none")
    .transition()
      .duration(750)
      .attr("transform", "translate(480,480)scale(23)rotate(180)")
    .transition()
      .delay(1500)
      .attr("transform", "translate(240,240)scale(0)")
      .style("fill-opacity", 0)
      .remove();
}
