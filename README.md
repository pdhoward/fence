
## Fence

A set of functions for simple and complex data mocking routines, including geofencing

The functions leverage turf.js, but add other feature rich capability for outdoor and indoor mapping routines and geo computations

## Getting Set Up

Getting the app running on your local machine takes only a few steps:

1. clone the project - `git clone https://github.com/pdhoward/fence.git
2. install its dependencies - `npm install`
3. start the app - npm run start
4 node server

## Usage

Point your browser to root for a webpage with available APIs

Point the browser at various end points to trigger data streaming

see server.js as well for details

An endpoint 'api/chaos' emits a continual stream of chatter to test 'interactions' with microservices (bots) on the microplex platform

This same endpoint can be modified to emulate traffic, shipments or other objects that are being tracked. A message structure with geolocations and appropriate identifying info would be
published.

## License and Use
 [LICENSE](LICENSE.txt).

## Contributing

For details, check out [CONTRIBUTING](CONTRIBUTING.md).
xio labs and affiliates
connecting businesses with the conversational economy
