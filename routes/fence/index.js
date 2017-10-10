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

// spoofing by publishing a text message periodically based on timer parameter
module.exports = function(router) {
    router.use(bodyParser.json());
      //evaluate a new message
      router.use(function(req, res, next) {
        console.log('GeoFence Detected in City - Send Message');

        function chaoticMessage() {
          console.log(req.body)
          //  var sendMsg = JSON.stringify(message)
          //  pub.publish('city', sendMsg);
      };

        chaoticMessage()

        next()
    })
  }
