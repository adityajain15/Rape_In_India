<template>
  <div class="db w-90 center">
    <template v-for="record in records">
      <div class="w-50 w-25-ns dib pa2 mv3 white teko v-top">
        <Stats :record="record" :avgChargesheet="avgChargesheet" :avgDisposed="avgDisposed" :avgCourtDisposal="avgCourtDisposal"/>
        <span class="db tc f4  mt1">{{record.State}}</span>
      </div>
    </template>
  </div>
</template>

<script>
import { csv as d3csv } from 'd3-fetch'
import { median, mean, sum } from 'd3-array'
import Stats from './components/Stats'

export default {
  name: 'SankeyMultiples',
  components: {
    Stats
  },
  data () {
    return {
      records: [],
      avgChargesheet: 0,
      avgDisposed: 0,
      avgCourtDisposal: 0
    }
  },
  async mounted () {
    this.records = await d3csv('out.csv')
    const chargesheetRates = this.records.map(d=>((d['police_chargesheet'] / d['police_disposed']) * 100))
    const disposalRates = this.records.map(d=>((d['police_disposed'] / d['total']) * 100))
    const courtDisposalRates = this.records.map(d=>((d['court_disposal'] / d['court_total']) * 100))
    this.avgChargesheet = parseFloat(mean(chargesheetRates).toFixed(2))
    this.avgDisposed = parseFloat(mean(disposalRates).toFixed(2))
    this.avgCourtDisposal = parseFloat(mean(courtDisposalRates).toFixed(2))
  }
}
</script>

<style>

</style>
