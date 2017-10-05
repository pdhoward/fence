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

let message = messages['twilio']

// spoofing by publishing a text message periodically based on timer parameter
module.exports = function(router) {
    router.use(bodyParser.json());
      //evaluate a new message
      router.use(function(req, res, next) {
        console.log('Chaotic Publish');

        function stream() {
          var msgObj = banter[Math.floor(Math.random() * banter.length)];
          message.Body = msgObj.text
          message.From = msgObj.name
          message.ToCity = ""
          message.FromZip - ""
          message.smsSid = ""
          message.FromState = ""
          message.FromCity = ""
          message.To = "webinar"
          message.MessagingServiceSid = "",
          message.ToZip = ""
          message.MessageSid = uuidv1()
          message.AcccountSid = ""
          message.PostDate = Date.now()

          var sendMsg = JSON.stringify(message)
          pub.publish('banter', message);
        }

        function chaoticMessage() {
          setInterval(function() {
          stream()
        }, 5000)};

        chaoticMessage()

        next()
    })
  }
