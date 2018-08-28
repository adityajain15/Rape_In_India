<template>
  <div class="db w-90 center">
    <div class="db w-50 center">
      <BarChart v-if="data"
        class="w-100"
        :data="batchData(data.filter(d=>d.State == 'National')[0])" 
        :numTicks="4"
        verticalScaleType="log"
        :styleFunction="barchartStyle"/>
      <h3 class="tc f3">India</h3>
    </div>
    <template v-for="record in data">
      <div v-if="record.State !== 'National'"
        class="dib w-25 mv3 v-top">
        <BarChart 
          class="w-100"
          :key="record.State" 
          :data="batchData(record)" 
          :domain="[1,5000]" 
          :numTicks="3"
          verticalScaleType="log"
          :styleFunction="barchartStyle"/>
        <h5 class="tc f4">{{record.State}}</h5>
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
  computed: {
  },
  methods: {
    fillFunction (feature) {
      const featureData = parseInt(this.ncrbData.filter(d=>d.State===feature.properties['NAME_1'])[0]['Rape_Total'])
      return {
        fill: this.scale(featureData)
      }
    },
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
          fill: 'orange',
          stroke: 'none'
        }
      }
      return {
        stroke: 'orange'
      }
    }
  }
}
</script>

<style scoped>
h3 {
  color: white;
  font-family: 'Teko', sans-serif;
}
h5 {
  color: white;
  font-family: 'Teko', sans-serif;
}
</style>
