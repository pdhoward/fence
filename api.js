'use strict';

//////////////////////////////////////////////////////////////////////////
/////////////////     API Catalogue for db store   //////////////////////
/////////////////    server side 'in memory' db    //////////////////////
////////////////////////////////////////////////////////////////////////

const clone =     require('clone')
const config =    require('./db/config')
const geopoints = require('./db/points')
const csv =       require('csvtojson')

const statecsvfile='./db/states.csv'

// unit test db stores
const db = {}
const geoDB = {}

///////////////////////////////////////////////////////
//////           verify test stores              /////
/////////////////////////////////////////////////////

const showpoints = () => {
   return geopoints
}

////////////////////////////////////
//////  geojson db functions //////
//////////////////////////////////
const getGeoData = (token) => {
  let data = geoDB[token]
  if (data == null) {
    data = geoDB[token] = clone(geopoints)
  }
  return data
}

const getGeoConfig = (token) => {
  let data = config.mapbox
  return data
}

///////////////////////////////////////
////// retrieve locations file //////
////////////////////////////////////

const getStates = (token) => {
  csv()
  .fromFile(statecsvfile)
  .on('json',(jsonObj)=>{
      // combine csv header row and csv line to a json object
      // jsonObj.a ==> 1 or 4
      console.log(">>>>getstates<<<<")
      console.log(jsonObj)
  })
  .on('done',(error)=>{
      console.log('end')
  })
}


module.exports = {
  showpoints,
  getGeoData,
  getGeoConfig,
  getStates

}
