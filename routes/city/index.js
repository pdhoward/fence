'use strict';

////////////////////////////////////////////////////////////
//////       Microservice Interaction Engine           ////
/////             c2016 XIO. Patent Pending           ////
////            test facility sending random texts    ////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const banter =        require('../../texts')
const pub =           require('../../app/stream').pub
const messages =      require('../../db/messageformat')
const uuidv1 =        require('uuid/v1');

let message = messages['geotag']

// spoofing by publishing a text message periodically based on timer parameter
module.exports = function(router) {
    router.use(bodyParser.json());
      //evaluate a new message
      router.use(function(req, res, next) {
        console.log('Stream City Locations');

        function stream() {
        //  var msgObj = banter[Math.floor(Math.random() * banter.length)];
          message._id = uuidv1()
          message.latitude = "spoof"
          message.longitude = "spoof"
          message.xcoord = ""
          message.ycoord - ""
          message.fenceId = "ChaoticBot"
          message.tagId = ""
          message.PostDate = Date.now()

          var sendMsg = JSON.stringify(message)
          pub.publish('city', sendMsg);
        }

        function chaoticMessage() {
          setInterval(function() {
          stream()
        }, 3000)};

        chaoticMessage()

        next()
    })
  }
