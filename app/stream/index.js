'use strict';
/////////////////////////////////////////////////////
////////  stream data app component           ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////
const config 	= 		require('../config');
const Redis =       require('ioredis');

// config data for redis labs cloud service
let port =        config.redis.port;
let host =        config.redis.host;
let password =    config.redis.password;

let redis = new Redis({ port: port,
                        host: host });
let pub =   new Redis({ port: port,
                        host: host })

exports.init = function(app) {
	let server 	= 	require('http').Server(app);
  // subscribe to redis
  redis.subscribe('newMessage', function (err, count) {
			console.log("Subscribed to " + count + " channel")
    });
  redis.on('message', function (channel, message) {
       console.log('Received  ' + channel + ' message: ' + message);
     });
	return server;
}
