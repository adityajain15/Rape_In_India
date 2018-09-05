<template>
  <div class="dib w-100 w-50-ns">
    <IndiaMap class="w-100 vh-75" :featureStyle="this.fillFunction"/>
    <MapLegend class="w-100 db center w-90-ns h3" :mapScale="scale" :scaleMinMax="[0, 5000]"/>
  </div>
</template>

<script>
import IndiaMap from './components/IndiaMap'
import MapLegend from './components/MapLegend'
import { csv as d3csv } from 'd3-fetch'
import { scaleThreshold } from 'd3-scale'
import { interpolateBlues, schemeYlOrRd } from 'd3-scale-chromatic'
export default {
  name: 'MapNumber',
  components: {
    IndiaMap,
    MapLegend
  },
  data () {
    return {
      ncrbData: []
    }
  },
  async created () {
    try {
      this.ncrbData = await d3csv('tab1.csv')
    } catch (err) {
      console.log(err)
    }
  },
  computed: {
    scale () {
      return scaleThreshold()
      .domain([150, 400, 800, 1600, 3200])
      .range(schemeYlOrRd[6])
    }
  },
  methods: {
    fillFunction (feature) {
      const featureData = parseInt(this.ncrbData.filter(d=>d.State===feature.properties['NAME_1'])[0]['Rape_Total'])
      return {
        fill: this.scale(featureData)
      }
    }
  }
}
</script>

<style scoped>

</style>
