<template>
  <div class="w-100 w-50-ns">
    <IndiaMap class="w-100 vh-75" :featureStyle="this.fillFunction"/>
    <LegendLinear class="w-100 db center w-90-ns h3" :mapScale="scale"/>
  </div>
</template>

<script>
import IndiaMap from './components/IndiaMap'
import LegendLinear from './components/LegendLinear'
import { csv as d3csv } from 'd3-fetch'
import { scaleQuantize, scaleLog, scalePow, scaleSequential } from 'd3-scale'
import { interpolateBlues, schemeYlOrRd, interpolateViridis } from 'd3-scale-chromatic'
import { extent } from 'd3-array'

export default {
  name: 'MapNumber',
  components: {
    IndiaMap,
    LegendLinear
  },
  data () {
    return {
      ncrbData: [],
      domain: []
    }
  },
  async created () {
    try {
      this.ncrbData = await d3csv('tab1.csv')
      this.domain = extent(this.ncrbData, d=>{
        return parseFloat(d['Rape_Rate'])
      })
    } catch (err) {
      console.log(err)
    }
  },
  computed: {
    scale () {
      return scaleSequential(interpolateViridis)
        .domain(this.domain)
    }
  },
  methods: {
    fillFunction (feature) {
      const featureData = this.ncrbData.filter(d=>d.State===feature.properties['NAME_1'])[0]['Rape_Rate']
      return {
        fill: this.scale(featureData)
      }
    }
  }
}
</script>

<style scoped>

</style>
