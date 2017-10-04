'use strict';

////////////////////////////////////////////////////////////
//////       Microservice Interaction Engine           ////
/////             c2016 XIO. Patent Pending           ////
////            test facility sending random texts    ////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const banter =        require('../../texts')
const config =        require('../../config')

const pub      =    require('./app/stream').pub

// spoofing by publishing a text message every 2 seconds
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
          console.log('publish');
          stream()
         }, 2000)};

        chaoticMessage()

        next()
    })
  }
