<template>
  <svg>
    <template v-for="(feature, i) in this.mapData.features">
      <path :name="feature.properties['NAME_1']" :key="i" :d="path(feature.geometry)" :style="featureStyle(feature)" />
    </template>
  </svg>
</template>

<script>
import { json as d3json } from 'd3-fetch'
import { geoMercator, geoPath } from 'd3-geo'
const debounce = require('lodash.debounce')

export default {
  name: 'IndiaMap',
  props: ['featureStyle'],
  data () {
    return {
      mapData: {},
      width: 400,
      height: 400
    }
  },
  async mounted () {
    this.resizeWindow()
    window.addEventListener('resize', debounce(this.resizeWindow, 60))

    try {
      this.mapData = await d3json('india_geo.json')
    } catch (err) {
      console.log(err)
    }
  },
  computed: {
    projection () {
      return geoMercator()
        .fitSize([this.width, this.height], this.mapData)
    },
    path () {
      return geoPath(this.projection)
    }
  },
  methods: {
    resizeWindow () {
      this.width = this.$el.getBoundingClientRect().width
      this.height = this.$el.getBoundingClientRect().height
    }
  }
}
</script>

<style>

</style>
