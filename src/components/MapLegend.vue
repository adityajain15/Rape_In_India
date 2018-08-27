<template>
  <svg>
    <template v-for="rect in rectArray">
      <rect :x="rect.x" :y="rect.y" :width="rect.width" height="12px" :fill="rect.color" />
    </template>
    <template v-for="tick in allTicks">
      <path :d="`M ${scale(tick) + margin},${12 + margin} L ${scale(tick) + margin},${18 + margin}`"/>
      <text :x="scale(tick) + margin" :y="`${30 + margin}px`">{{tick}}</text>
    </template>
  </svg>
</template>

<script>
import { scaleLinear } from 'd3-scale'
const debounce = require('lodash.debounce')

export default {
  name: 'MapLegend',
  props: ['mapScale', 'scaleMinMax'],
  data () {
    return {
      width: 400,
      height: 100,
      margin: 10
    }
  },
  async mounted () {
    this.resizeWindow()
    window.addEventListener('resize', debounce(this.resizeWindow, 60))
  },
  computed: {
    scale () {
      return scaleLinear()
        .domain([this.scaleMinMax[0], this.scaleMinMax[1]])
        .range([0, this.width - (2 * this.margin)])
    },
    rectArray () {
      const mapScaleRange = this.mapScale.range()
      const rectArr = []
      for (let i = 0; i < mapScaleRange.length; i++) {
        const d = this.mapScale.invertExtent(mapScaleRange[i])
        if (d[0] == null) d[0] = this.scale.domain()[0]
        if (d[1] == null) d[1] = this.scale.domain()[1]
        const rect = {
          x: this.scale(d[0]) + this.margin,
          y: this.margin,
          height: 10,
          width: this.scale(d[1]) - this.scale(d[0]),
          color: mapScaleRange[i]
        }
        rectArr.push(rect)
      }
      return rectArr
    },
    allTicks () {
      return [...this.scaleMinMax,...this.mapScale.domain()]
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
text{
  fill: white;
  text-anchor: middle;
  font-size: 0.5em;
  font-family: -apple-system, 'Helvetica Neue', sans-serif;
}
path{
  stroke:white;
}
</style>
