<template>
  <svg>
    <template v-for="rect in rectArray">
      <rect :x="rect.x" :y="rect.y" :width="rect.width" :height="rect.height" :fill="rect.color" />
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
  name: 'LegendLinear',
  props: ['mapScale'],
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
        .domain(this.mapScale.domain())
        .range([0, this.width - (2 * this.margin)])
    },
    rectArray () {
      const rectArr = []
      for (let i = 0; i < this.width - (2 * this.margin); i++) {
        const rect = {
          x: i + this.margin,
          y: this.margin,
          height: 12,
          width: 1.2,
          color: this.mapScale(this.scale.invert(i))
        }
        rectArr.push(rect)
      }
      return rectArr
    },
    allTicks () {
      return this.scale.ticks()
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