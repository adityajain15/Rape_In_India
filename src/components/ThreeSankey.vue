<template>
  <div id="particleSankey">
    <canvas id="drawingBoard" :width="correctedWidth" :height="correctedHeight"/>
    <template v-for="(node, i) in this.textNodes">
      <span :key="i" :style=getSpanPosition(node)>{{node.name}}</span>
      <div v-if="node.dy > 1" class="sankeyNodes" :key="node.name" :style=getNodePosition(node)></div>
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
    }, 
    mobile () {
      return this.width < 480
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
        top: `${this.mobile ? 5 + node.x + (node.dx / 2) : node.y}px`,
        left: `${this.mobile ? node.y : 5 + node.x + node.dx}px`,
        width: `${this.mobile ? node.dy : node.dx}px`,
        'min-width': `${this.mobile ? 1 : 50}px`,
        'font-size': `${this.mobile ? 7 : 10}px`  
      }
    },
    getNodePosition (node) {
      return {
        top: `${this.mobile ? node.x : node.y}px`,
        left: `${this.mobile ? node.y : node.x}px`,
        width: `${this.mobile ? node.dy : node.dx}px`,
        height: `${this.mobile ? node.dx : node.dy}px`
      }
    }
  }
}
</script>

<style scoped>
#particleSankey{
  height: 90vh;
  position: relative;
}

.sankeyNodes {
  position: absolute;
  border: 1px solid white;
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
}
</style>
