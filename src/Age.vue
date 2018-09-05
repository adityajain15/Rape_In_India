<template>
  <div class="db w-90 center">
    <div class="db w-90 w-50-ns center mv5">
      <BarChart v-if="data"
        class="w-100 vh-50"
        style="min-height: 300px"
        :data="batchData(data.filter(d=>d.State == 'National')[0])" 
        :numTicks="4"
        verticalScaleType="log"
        :styleFunction="barchartStyle"
        :marginBottom="75"/>
      <h3 class="tc f3 mt2 teko white">Age of victims in reported rape crimes across India</h3>
    </div>
    <template v-for="record in data">
      <div v-if="record.State !== 'National'"
        class="dib w-third w-25-ns mv3 v-top">
        <BarChart 
          class="w-100"
          :key="record.State" 
          :data="batchData(record)" 
          :domain="[1,5000]" 
          :numTicks="3"
          verticalScaleType="log"
          :styleFunction="barchartStyle"
          :horizontalAxis="false"
          :margin="[0, 0, 0, 0]"/>
        <h5 class="tc f4 teko white">{{record.State}}</h5>
      </div>
    </template>
  </div>
</template>

<script>
import BarChart from './components/BarChart'
import { csv as d3csv } from 'd3-fetch'

export default {
  name: 'Age',
  components: {
    BarChart
  },
  data () {
    return {
      data: false
    }
  },
  async created () {
    try {
      this.data = await d3csv('age.csv')
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    batchData (record) {
      return Object.keys(record).filter(d=>d!=="State" && d!=="Number of Cases" && d!=="Total Minor Victims" && d!=="Total Adult Victims" && d!=="Total Victims").map(d => {
        return {
          key: d,
          value: parseInt(record[d])
        }
      })
    },
    barchartStyle (record) {
      const name = record.key
      if (name === 'Below 6 Years' || name === 'Between 6 and 12 Years' || name === 'Between 12 and 16 Years' || name === 'Between 16 and 18 Years') {
        return {
          fill: 'red',
          stroke: 'none'
        }
      }
      return {
        stroke: 'red'
      }
    }
  }
}
</script>

<style scoped>
</style>
