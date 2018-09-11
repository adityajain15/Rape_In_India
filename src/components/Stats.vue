<template>
  <div class="card ph2">
    <div class="mv3">
      <span class="db teko-body f5">Police investigations pending at the end of 2016</span>
      <span class="dib f2">{{record['police_pending_2016']}}</span>
      <span class="dib f4 ml1" :style="pendingChange > 0 ? `color: red;`: `color: limegreen;`">
        {{`${pendingChange > 0 ? '↑' : '↓'}${Math.abs(pendingChange)}`}}
      </span>
      <span class="dib f5 teko-body ml1">
        {{`from last year`}}
      </span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Police disposal rate</span>
      <span class="f2" :style="avgDisposed > disposalRate ? `color: red;`: `color: limegreen;`">{{`${disposalRate}%`}}</span>
      <span class="dib ml1 teko-body">{{`${avgDisposed > disposalRate ? 'Below average': 'Above average'}`}}</span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Chargesheeting rate</span>
      <span class="f2 dib" :style="chargeSheetRate < avgChargesheet ? `color: red;`: `color: limegreen;`">{{`${chargeSheetRate}%`}}</span>
      <span class="dib ml1 teko-body">{{`${chargeSheetRate < avgChargesheet ? 'Below average': 'Above average'}`}}</span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Court trials pending at the end of 2016</span>
      <span class="dib f2">{{this.record['court_pending']}}</span>
      <span class="dib f4 ml1" :style="courtPendingChange > 0 ? `color: red;`: `color: limegreen;`">
        {{`${courtPendingChange > 0 ? '↑' : '↓'}${Math.abs(courtPendingChange)}`}}
      </span>
      <span class="dib f5 teko-body ml1">
        {{`from last year`}}
      </span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Court disposal rate</span>
      <span class="f2" :style="avgCourtDisposal > courtDisposalRate ? `color: red;`: `color: limegreen;`">{{`${courtDisposalRate}%`}}</span>
      <span class="dib ml1 teko-body">{{`${avgCourtDisposal > courtDisposalRate ? 'Below average': 'Above average'}`}}</span>
    </div>
    <div class="mv3">
      <span class="db teko-body">Conviction rate</span>
      <template v-if="record['court_completed']!=0">
        <span class="f2" :style="avgConviction > courtConvicted ? `color: red;`: `color: limegreen;`">{{`${courtConvicted}%`}}</span>
        <span class="dib ml1 teko-body">{{`${avgConviction > courtConvicted ? 'Below average': 'Above average'}`}}</span>
      </template>
      <template v-else>
        <span class="f2">NA</span>
      </template>
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
    },
    avgDisposed: {
      type: Number,
      default: 0
    },
    avgChargesheet: {
      type: Number,
      default: 0
    },
    avgCourtDisposal: {
      type: Number,
      default: 0
    },
    avgConviction: {
      type: Number,
      default: 0
    }
  },
  computed: {
    disposalRate () {
      return parseFloat((this.record['police_disposed'] / this.record['total']) * 100).toFixed(1)
    },
    courtDisposalRate () {
      return parseFloat((this.record['court_disposal'] / this.record['court_total']) * 100).toFixed(1)
    },
    courtConvicted () {
      return parseFloat((this.record['court_convicted'] / this.record['court_completed']) * 100).toFixed(1)
    },
    pendingChange () {
      return this.record['police_pending_2016'] - this.record['police_pending_2015']
    },
    chargeSheetRate () {
      return (parseFloat(this.record['police_chargesheet'] / this.record['police_disposed']) * 100).toFixed(1)
    },
    courtPendingChange () {
      return this.record['court_pending'] - this.record['court_2015']
    },
    trialPendingRatio () {
      return parseFloat(this.record['court_2015'] / this.record['court_2016']).toFixed(2)
    }
  },
  methods: {
    resizeWindow () {
      this.width = this.$el.getBoundingClientRect().width
      this.height = this.$el.getBoundingClientRect().height
      this.mobile = window.innerWidth < 480
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid white;
}
</style>
