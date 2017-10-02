
'use strict';
/////////////////////////////////////////////////////
////////  		geofence prototype             ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////
const turf =      require('@turf/turf');
const fs =        require('fs');
const geolib =    require('geolib')

// demo of calculations -- using turf and geolib -- for geofence
// actions
// to run -- node turf

let randomPoints = fs.readFileSync('./input/random.geojson');

randomPoints = JSON.parse(randomPoints);

// turf.convex() returns a Convex Hull of the points:
// the smallest possible polygon that could fit all of them inside - returns GeoJSON

let convexHull = turf.convex(randomPoints);

// files can be viewed via geojson.io, TileMill, QGIS, or ArcGIS
fs.writeFileSync('./convex_hull.geojson', JSON.stringify(convexHull));

console.log('saved convex_hull.geojson');

console.log("=====================")
console.log(geolib.isPointInside(
    {latitude: 51.5125, longitude: 7.485},
    [
        {latitude: 51.50, longitude: 7.40},
        {latitude: 51.555, longitude: 7.40},
        {latitude: 51.555, longitude: 7.625},
        {latitude: 51.5125, longitude: 7.625}
    ]
  ))
// checks if 51.525, 7.4575 is within a radius of 5km from 51.5175, 7.4678
console.log(geolib.isPointInCircle(
    {latitude: 51.525, longitude: 7.4575},
    {latitude: 51.5175, longitude: 7.4678},
    5000
  ))

//   parm#3 is accuracy (digit to round to), parm#4 is precision 1 = meter, 2 decimeter, 3 centimeter
console.log("distance calculated")
console.log(geolib.getDistance(
    {latitude: 51.5103, longitude: 7.49347},
    {latitude: "51° 31' N", longitude: "7° 28' E"},
    10, 3
))

////////////////////

var point1 = {latitude: 0.5, longitude: 0};
var point2 = {latitude: 0, longitude: 10};
var point3 = {latitude: 0, longitude: 15.5};
var start  = {latitude: 0, longitude: 0};
var end    = {latitude: 0, longitude: 15};

var isInLine1 = geolib.isPointInLine(point1, start, end) //-> false;
var isInLine2 = geolib.isPointInLine(point2, start, end) //-> true;
var isInLine3 = geolib.isPointInLine(point3, start, end) //-> false;
console.log("Is this in the line")
console.log(isInLine1)

////////
console.log("TURF - Is this in the line")
const line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
const point = turf.point([1, 2]);

console.log(turf.booleanContains(line, point))
console.log("TURF - Lines Cross")
var line1 = turf.lineString([[-2, 2], [4, 2]]);
var line2 = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);

var cross = turf.booleanCrosses(line1, line2);
console.log(cross)
