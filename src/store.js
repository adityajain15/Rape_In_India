import Vue from 'vue'
import Vuex from 'vuex'
import { geoMercator } from 'd3-geo'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    height: 500,
    width: 500,
    table1: [],
    india_geo: {},
    allPoints: {},
    allPositions: [],
    layout2: []
  },
  mutations: {
    addCrimeTotal (state, payload) {
      state.table1.push(payload)
    },
    addIndiaFeature (state, payload) {
      state.india_geo[payload.key] = payload.data
    },
    addPoint (state, payload) {
      if (!state.allPoints.hasOwnProperty(payload.key)) { state.allPoints[payload.key] = [] }
      state.allPoints[payload.key].push([payload.data[0], payload.data[1]])
      state.allPositions.push([payload.data[0], payload.data[1]])
    },
    setWindowHeight (state, payload) {
      state.height = payload
    },
    setWindowWidth (state, payload) {
      state.width = payload
    }
  },
  getters: {
    getCrimeTotals (state, getters) {
      return state.table1
    },
    getIndiaGeo (state) {
      return function (key) {
        return state.india_geo[key]
      }
    },
    getStates (state) {
      return state.allPoints
    },
    getPoints (state, getters) {
      const projection = geoMercator()
        .translate([state.width / 2, state.height / 2])
        .scale(1000)
        .center([82.94393157959001, 21.868324442109888])

      return state.allPositions.map(d => projection(d))
    },
    minDimension (state) {
      return Math.min(state.width, state.height)
    },
    sideLength (state, getters) {
      return 1
    },
    layout2 (state, getters) {
      //338954
      const positions = [...Array(338954).keys()].map(d => {
        const xPosition = ((d % 583))
        const yPosition = Math.floor(d / 583)
        return [xPosition, yPosition]
      })
      return positions
    }
  }
})
