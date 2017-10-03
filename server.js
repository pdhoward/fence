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

// static location aware services tests
app.use('/geo', express.static('public/geo'))
app.use('/grid', express.static('public/grid'))
app.use('/matrix', express.static('public/matrix'))
app.use(cors())

// help doc
app.get('/', (req, res) => {
  const help = `
  <pre>
    xio geofence test platform

    Point your browser to the specific path to trigger a geofence use case

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
      error: 'Please provide an Authorization header to identify yourself (can be whatever you want)'
    })
  }
})

// api modeling fetch of geojson data - simulating movement and geofencing
/*
// webpage
app.get('/api/geo', (req, res) => {
  res.sendFile(geoMap, { root: __dirname })
})
*/
//config data - mapbox
app.get('/api/geoconfig', bodyParser.json(), (req, res) => {
  res.send(api.getGeoConfig(req.token))
})
// geojson
app.get('/api/geopoints', bodyParser.json(), (req, res) => {
  res.send(api.getGeoData(req.token))
})


// spin up http server
app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
