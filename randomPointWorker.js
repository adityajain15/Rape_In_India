importScripts('https://npmcdn.com/@turf/turf/turf.min.js', 'https://d3js.org/d3-geo.v1.min.js')
onmessage = function (e) {
  const stateGeometry = e.data[0]
  const boundingBox = turf.bbox(stateGeometry)
  let pointFound = false
  while (!pointFound) {
    const randPoint = turf.randomPoint(1, {bbox: boundingBox})
    if (d3.geoContains(stateGeometry, randPoint.features[0].geometry.coordinates)) {
      pointFound = true
      postMessage(randPoint.features[0])
    }
  }
}
