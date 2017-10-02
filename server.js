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

// serve map for location aware services tests
app.use('/geo', express.static('public'))
app.use(cors())

// help doc
app.get('/', (req, res) => {
  const help = `
  <pre>
    xio geofence test platform

    Point your browser to the specific path to triegger a geofence use case

    &copy2016 xio all rights reserved
  </pre>
  `

  res.send(help)
})

// display content of various test db stores
app.get('/showagents', (req, res) => {
  res.send(api.showagents())
})
app.get('/showclients', (req, res) => {
  res.send(api.showclients())
})
app.get('/showpoints', (req, res) => {
  res.send(api.showpoints())
})
app.get('/showcontext', (req, res) => {
  res.send(api.showcontext())
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

// api catalogue - default standard
app.get('/api', (req, res) => {
  res.send(api.get(req.token))
})

app.delete('/api/:id', (req, res) => {
  res.send(api.remove(req.token, req.params.id))
})

app.post('/api', bodyParser.json(), (req, res) => {
  const { name, email } = req.body

  if (name && email) {
    res.send(contacts.add(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide both a name and email address'
    })
  }
})

// api modeling the primary platform data stores
app.get('/api/agent', (req, res) => {
  res.send(api.getAgent(req.token))
})

app.get('/api/agentarray', (req, res) => {
  res.send(api.getAgent(req.token))
})

app.get('/api/client', (req, res) => {
  res.send(api.getClient(req.token))
})
app.get('/api/context', (req, res) => {
  res.send(api.getContext(req.token))
})

app.get('/api/onecontext', bodyParser.json(), (req, res) => {
  console.log(JSON.stringify(req.query))
  const { session } = req.query
  res.send(api.getOneContext(req.token, session))
})

app.post('/api/context', bodyParser.json(), (req, res) => {
  const { session, nextAction, context } = req.body

  if ( session && nextAction && context) {
    res.send(api.addContext(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide all required data'
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
