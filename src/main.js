import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { csvParse } from 'd3-dsv'
import { randomPoint } from '@turf/random'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import bbox from '@turf/bbox'
import { geoContains } from 'd3-geo'
/*
const Table1 = fetch('./tab1.csv')
  .then(response => response.text())
  .then(response => {
    csvParse(response)
      .map(d => store.commit('addCrimeTotal', d))
  })

const IndiaGeo = fetch('./india_geo.json')
  .then(response => response.json())
  .then(response => response.features.map(d => store.commit('addIndiaFeature', { key: d.properties['NAME_1'], data: d })))

const indiaPoints = fetch('./something3.json')
  .then(response => response.json())
  .then(response => {
    const keys = Object.keys(response)
    for (let i = 0; i < keys.length; i++) {
      response[keys[i]].map(d => store.commit('addPoint', {key: keys[i], data: d}))
    }
  })

Promise.all([Table1, IndiaGeo])
  .then(() => {
    store.getters.getCrimeTotals.map(d => {
      const totalCrimes = d['2016']
      const stateGeometry = store.getters.getIndiaGeo(d.State)
      const boundingBox = bbox(stateGeometry)
      let numPoints = 0
      while (numPoints < totalCrimes) {
        const randPoint = randomPoint(1, {bbox: boundingBox})
        if (geoContains(stateGeometry, randPoint.features[0].geometry.coordinates)) {
          store.commit('addPoint', { key: d.State, data: randPoint.features[0].geometry.coordinates })
          numPoints++
        }
      }
    })
  })*/

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
