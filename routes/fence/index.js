'use strict';

////////////////////////////////////////////////////////////
//////       Microservice Interaction Engine           ////
/////             c2016 XIO. Patent Pending           ////
////        conveying msg when geofence detected     ////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const pub =           require('../../app/stream').pub
const messages =      require('../../db/messageformat')
const uuidv1 =        require('uuid/v1');

let message = messages['geotag']

module.exports = function(router) {
    router.use(bodyParser.json());
      //evaluate a new message

      // REFACTOR To Link to droid or publish on REDIS
      router.use(function(req, res, next) {
        console.log('GeoFence Detected in City - Send Message');
        console.log(req.body)
        console.log(req.token)
        res.send({message: "success"})
      //  next()
    })
  }
