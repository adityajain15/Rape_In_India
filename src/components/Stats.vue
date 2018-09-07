<template>
  <div>
    <div class="mv3">
      <span class="db teko-body f5">Police investigations pending at the end of 2016</span>
      <span class="dib f2">{{record['police_pending_2016']}}</span>
      <span class="dib f4 ml1" :style="pendingChange > 0 ? `color: red;`: `color: limegreen;`">
        {{`${pendingChange > 0 ? '↑' : '↓'}${Math.abs(pendingChange)}`}}
      </span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Ratio of number of new cases registered in 2016 to number of pending police investigations at the end of 2015</span>
      <span v-if="parseInt(record['police_pending_2015']) !== 0" class="f2" :style="ratioNewToOld > 1 ? `color: red;`: `color: limegreen;`">
        {{ratioNewToOld}}
      </span>
      <span v-else class="f2">NA</span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Chargesheeting rate</span>
      <span class="f2 dib" :style="chargeSheetRate < nationalAvgChargesheet ? `color: red;`: `color: limegreen;`">{{chargeSheetRate}}</span>
      <span class="dib ml1">{{`${(chargeSheetRate < nationalAvgChargesheet) ? 'Below national average': 'Above national average'}`}}</span>
    </div>
  </div>
</template>

<script>

const debounce = require('lodash.debounce')

export default {
  name: 'Stats',
  data () {
    return {
      width: 400,
      height: 400,
      mobile: false
    }
  },
  props: {
    record: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ratioNewToOld () {
      return parseFloat(this.record['police_register_2016'] / this.record['police_pending_2015']).toFixed(2)
    },
    pendingChange () {
      return this.record['police_pending_2016'] - this.record['police_pending_2015']
    },
    chargeSheetRate () {
      return (parseFloat(this.record['police_chargesheet'] / this.record['police_disposed']) * 100).toFixed(1)
    },
    nationalAvgChargesheet () {
      return 87.6
    }
  },
  methods: {
    resizeWindow () {
      this.width = this.$el.clientWidth - this.marginRight - this.marginLeft
      this.height = this.$el.clientHeight - this.marginTop - this.marginBottom
      this.mobile = window.innerWidth < 480
    }
  }
}
</script>

<style scoped>

</style>
