<template>
  <svg>
    <g class="bargraph-bars">
      <template v-for="record in data">
        <rect v-if="record.value" :x="horizontalScale(record.key)" :y="height - verticalScale(record.value)" :width="horizontalScale.bandwidth()" :height="verticalScale(record.value)" :style="styleFunction(record)"/>
      </template>
    </g>
    <g class="bargraph-grid">
      <template v-for="tick in verticalTicks">
        <path :d="`M 0,${height - verticalScale(tick)} L ${width},${height - verticalScale(tick)}`" class="gridScale" :name="tick"/>
      </template>
    </g>
    <g class="bargraph-labels">
      <template v-for="tick in verticalTicks">
        <text x="0" :y="height - verticalScale(tick)">{{tick}}</text>
      </template>
    </g>
  </svg>
</template>

<script>
const debounce = require('lodash.debounce')
import { scaleBand, scaleLog } from 'd3-scale'
import { max, extent } from 'd3-array'

export default {
  name: 'BarChart',
  props: {
    data: {
      type: Array,
      default: [],
      required: true
    },
    paddingInner: {
      type: Number,
      default: 0.2
    },
    paddingOuter: {
      type: Number,
      default: 0.5
    },
    domain: {
      type: Array,
      default: function () {
        return [1, Math.max(...this.data.map(d=>d.value))]
      }
    },
    numTicks: {
      type: Number
    },
    verticalScaleType: {
      type: String,
      default: 'linear'
    },
    styleFunction: {
      type: Function,
      default: function () {
        return function (record) {
          return {}
        }
      }
    }
  },
  data () {
    return {
      width: 400,
      height: 400
    }
  },
  mounted () {
    this.resizeWindow()
    window.addEventListener('resize', debounce(this.resizeWindow, 60))
  },
  computed: {
    horizontalScale () {
      return scaleBand()
        .domain(this.data.map(d=>d.key))
        .range([0, this.width])
        .paddingOuter(this.paddingOuter)
        .paddingInner(this.paddingInner)
    },
    verticalScale () {
      return scaleLog()
        .domain(this.domain)
        .range([this.verticalScaleType === 'log' ? 1 : 0, this.height])
    },
    verticalTicks () {
      return this.numTicks ? this.verticalScale.ticks(this.numTicks) : this.verticalScale.ticks()
    }
  },
  methods: {
    resizeWindow () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
    }
  }
}
</script>

<style scoped>
rect{
  stroke: red;
}
.gridScale{
  stroke: white;
  stroke-width: 0.5;
  stroke-dasharray: 2, 4;
}
text{
  fill: white;
  font-size: 0.5em;
  font-family: -apple-system, 'Helvetica Neue', sans-serif;
}
</style>
