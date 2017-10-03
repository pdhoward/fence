

//////////////////////////////////////////////////////////////////////////
/////////////////        Unit test server configs  //////////////////////
////////////////////////////////////////////////////////////////////////

exports.port = process.env.PORT || 5100
exports.origin = process.env.ORIGIN || `http://localhost:${exports.port}`

exports.mapbox = "pk.eyJ1IjoiY2hhb3RpY2JvdHMiLCJhIjoiY2o4M2ZneGN2NWY3djJ3bzNtNTJicG8xMyJ9.O_zBtJfCbw0ImPy8RetYIQ"

exports.redis = {
		"host": "redis-15416.c12.us-east-1-4.ec2.cloud.redislabs.com",
		"port": 15416,
		"password": "nashv1ll"
	}
