<template>
  <!--v-on:mousemove="mouseMove($event)"-->
  <canvas id="drawingBoard" :width="correctedWidth" :height="correctedHeight"/>
</template>

<script>
import store from './store'
import { geoMercator } from 'd3-geo'
const glslify = require('glslify')
const debounce = require('lodash.debounce')
const fragmentShader = require('raw-loader!glslify-loader!./shaders/frag.glsl')
const vertexShader = require('raw-loader!glslify-loader!./shaders/vertex.glsl')

export default {
  name: 'app',
  store,
  data () {
    return {
      regl: undefined
    }
  },
  mounted () {
    this.resizeFunc()
    window.addEventListener('resize', debounce(this.resizeFunc, 60))
    
    this.regl = require('regl')({
      canvas: this.$el
    })
    
    const drawPoints = this.regl({
      frag: fragmentShader,
      vert: vertexShader,
      attributes: {
        position: function (context, props) {
          return props.points
        }
      },
      uniforms: {
        color: function (context, props) {
          return [1.00, 0.001, 0.001, 1.000];
        },
        stageWidth:  function(context, props) {
          return props.width
        },
        stageHeight:  function(context, props) {
          return props.height
        }
      },
      count: function(context, props) {
        return props.points.length
      },
      primitive: 'points'
    })

    this.regl.frame(context => {
      drawPoints({
        points: this.$store.getters.getPoints,
        height: this.$store.state.height,
        width: this.$store.state.width
      })
    })
  },
  computed: {
    correctedWidth () {
      return this.$store.state.width * window.devicePixelRatio
    },
    correctedHeight () {
      return this.$store.state.height * window.devicePixelRatio
    }
  },
  methods: {
    resizeFunc () {
      this.$store.commit('setWindowWidth', this.$el.clientWidth)
      this.$store.commit('setWindowHeight', this.$el.clientHeight)
    },
    mouseMove (event) {
      console.log(event)
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}

canvas {
  height: 90vh;
  width: 90vw;
  margin-left: 5vw;
  margin-top: 5vh;
}
</style>
