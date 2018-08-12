<template>
  <div>
    <canvas id="drawingBoard" :width="correctedWidth" :height="correctedHeight"/>
    <template v-for="(node, i) in this.textNodes">
      <span :key="i" :style=getSpanPosition(node)>{{node.name}}</span>
    </template>
  </div>
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
      width: 200,
      textNodes: []
    }
  },
  computed: {
    correctedWidth () {
      return this.width * window.devicePixelRatio
    },
    correctedHeight () {
      return this.height * window.devicePixelRatio
    },
    vals () {
      return this.textNodes.map(d=>d.value)
    }
  },
  watch: {
    textNodes (newVal, oldVal) {
      //console.log(newVal)
    }
  },
  async mounted () {
    //resizing logic
    this.resize()
    window.addEventListener('resize', debounce(this.resize, 60))

    try {
      const reglInstance = regl({
        canvas: this.$el.children[0],
        attributes: {
          antialias: false
        }
      })
      const sankeyData = await d3csv(`${this.fileString}.csv`)
      const graph = new ParticleSankey(reglInstance, sankeyData, [this.$el.children[0].clientWidth, this.$el.children[0].clientHeight], this.textNodes)
      this.textNodes = graph.getNodes()
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    resize () {
      this.width = this.$el.children[0].clientWidth
      this.height = this.$el.children[0].clientHeight
    },
    getSpanPosition (node) {
      return {
        top: `${node.y}px`,
        left: `${node.x}px`,
        width: `${node.dy}px`
      }
    }
  }
}
</script>

<style>
div{
  height: 90vh;
  position: relative;
}
canvas {
  width: 100%;
  height: 100%;
}
span{
  color: white;
  position: absolute;
  font-family: Helvetica, sans-serif;
  font-weight: lighter;
  text-align: center;
  transform-origin: top left;
  transform: rotate(90deg);
  font-size: 0.5em;
}
</style>
