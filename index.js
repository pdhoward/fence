
'use strict';
/////////////////////////////////////////////////////
////////  		geofence prototype             ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////
const turf =      require('@turf/turf');
const fs =        require('fs');
const geolib =    require('geolib')

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
