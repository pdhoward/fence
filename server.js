'use strict';
/////////////////////////////////////////////////////
////////  		prototyping server             ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////

const express =     require('express')
const bodyParser =  require('body-parser')
const cors =        require('cors')
const config =      require('./db/config')
const api =         require('./api')

const app = express()

const ioServer =    require('./app/stream').httpserver(app);
const pub      =    require('./app/stream').pub

//////////////////////////////////////////////////////////////////////////
/////////// Register and Spoofing Config Routes /////////////////////////
////////////////////////////////////////////////////////////////////////

const banterRoute =     express.Router();
const cityRoute =       express.Router();
const fenceRoute =      express.Router();
// stream messages and publish to redis
require('./routes/banter')(banterRoute);
require('./routes/city')(cityRoute);

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

// messages streamed to redis channel
app.use('/msg/banter', banterRoute)
app.use('/msg/city', cityRoute)

// device being tracked as it navigates city streets
// http message published when geofence is intersected by the device
app.use('/geo', express.static('public/geo'))

// static location aware services
app.use('/grid', express.static('public/grid'))
app.use('/matrix', express.static('public/matrix'))
app.use('/quake', express.static('public/earthquake'))
app.use('/usa', express.static('public/usa'))

app.use(cors())

// help doc
app.get('/', (req, res) => {
  const help = `
  <pre>
    xio test platform

    Point your browser to the specific path to stream test data
    /msg/banter       ....   stream banter to redis banter channel
    /msg/city         ....   stream city geo data to redis city channe;

    /geo              ....   http message with geofence intersected by city traveler
                             opens web page with map overlay as well
    /grid             ....   grid visualization
    /matrix           ....   interactive matrix
    /usa              ....   usa visualization (not operational)
    /quake            ....   illustrate mapping technology with USGA earthquake data

    /showpoints       ....   api to render the contents of the geojson db (used by /geo)

    other APIs        ....   other api endpoints used by apps to retrieve config data    


    &copy2016 xio all rights reserved
  </pre>
  `

  res.send(help)
})

app.get('/showpoints', (req, res) => {
  res.send(api.showpoints())
})

// simple auth test
app.use((req, res, next) => {
  const token = req.get('Authorization')
  if (token) {
    req.token = token
    next()
  } else {
    res.status(403).send({
      Note: 'Request being process. Authorization header not detected'
    })
  }
})

//////////////////////////////////////////////////////////////////////////
/////////////////APIs render the Contents of DB Stores///////////////////
////////////////////////////////////////////////////////////////////////

//config data - mapbox
app.get('/api/geoconfig', bodyParser.json(), (req, res) => {
  res.send(api.getGeoConfig(req.token))
})
// geojson
app.get('/api/geopoints', bodyParser.json(), (req, res) => {
  res.send(api.getGeoData(req.token))
})

// read csv file with state data and return json
app.get('/api/getstates', bodyParser.json(), (req, res) => {
  res.send(api.getStates(req.token))
})

// spin up http server and redis connection
ioServer.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
