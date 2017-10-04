'use strict';

////////////////////////////////////////////////////////////
//////       Microservice Interaction Engine           ////
/////             c2016 XIO. Patent Pending           ////
////            test facility sending random texts    ////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Redis =         require('ioredis')
const banter =        require('../../texts')
const config =        require('../../config')

let redis = new Redis({
 port: config.redis.port,
 host: config.redis.host
});

let pub = new Redis({
 port: config.redis.port,
 host: config.redis.host
});

module.exports = function(router) {
    router.use(bodyParser.json());
      //evaluate a new message
      router.use(function(req, res, next) {
        console.log('Chaotic Subscribe');

        // subscribe and listen
        redis.subscribe('newMessage', function (err, count) {
        			console.log("Subscribed to " + count + " channel")
          });

        redis.on('message', function (channel, message) {
            console.log('Received the following from channel ' + channel + ' message: ' + message);
          });

        next()
    })
  }
