'use strict';

////////////////////////////////////////////////////////////
//////       Microservice Interaction Engine           ////
/////             c2016 XIO. Patent Pending           ////
////            test facility sending random texts    ////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const banter =        require('../../texts')
const pub =           require('../../app/stream').pub

// spoofing by publishing a text message periodically based on timer parameter
module.exports = function(router) {
    router.use(bodyParser.json());
      //evaluate a new message
      router.use(function(req, res, next) {
        console.log('Chaotic Publish');

        function stream() {
          var msgObj = banter[Math.floor(Math.random() * banter.length)];
          var sendMsg = JSON.stringify(msgObj)
          pub.publish('banter', sendMsg);
        }

        function chaoticMessage() {
          setInterval(function() {
          stream()
        }, 20000)};

        chaoticMessage()

        next()
    })
  }
