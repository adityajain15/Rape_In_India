<template>
  <canvas id="drawingBoard" :width="correctedWidth" :height="correctedHeight"/>
</template>

<script>
import ParticleSankey from '../assets/particleSankey'
import { csv as d3csv } from 'd3-fetch'
const debounce = require('lodash.debounce')
const regl = require('regl')

export default {
  name: 'ThreeSankey',
  props: ['fileString'],
  data () {
    return {
      height: 500,
      width: 200
    }
  },
  computed: {
    correctedWidth () {
      return this.width * window.devicePixelRatio
    },
    correctedHeight () {
      return this.height * window.devicePixelRatio
    }
  },
  async mounted () {
    //resizing logic
    this.resize()
    window.addEventListener('resize', debounce(this.resize, 60))

    try {
      const reglInstance = regl({
        canvas: this.$el,
        attributes: {
          antialias: false
        }
      })
      const sankeyData = await d3csv(`${this.fileString}.csv`)
      const graph = new ParticleSankey(reglInstance, sankeyData, [this.$el.clientWidth, this.$el.clientHeight])
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    resize () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
    }
  }
}
</script>

<style>

canvas {
  height: 90vh;
  width: 90vw;
  margin-left: 5vw;
  margin-top: 5vh;
}
</style>
