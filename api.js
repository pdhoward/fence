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
  let arr = []
  csv({flatKeys:true})
  .fromFile(statecsvfile)
  .on('json',(data, indx)=>{
      arr[indx] = data
  })
  .on('done',(error)=>{
    if(error){console.log(error)}
    console.log('end')
    console.log(arr)
    return arr
  })
}


module.exports = {
  showpoints,
  getGeoData,
  getGeoConfig,
  getStates

}
