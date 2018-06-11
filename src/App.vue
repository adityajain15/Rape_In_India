<template>
  <canvas id="drawingBoard" :width="correctedWidth" :height="correctedHeight"/>
</template>

<script>
import store from './store'
import { geoMercator } from 'd3-geo'
var debounce = require('lodash.debounce')

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
      canvas: this.$el,
      attributes: {
			  antialias: true
		  }
    })
    const that = this
    

    const drawPoints = this.regl({
      frag: `
      precision highp float;
      uniform vec4 color;
      void main () {
        gl_FragColor = color;
      }`,

      vert: `
      precision mediump float;
      attribute vec2 position;

      uniform float stageWidth;
      uniform float stageHeight;

      // helper function to transform from pixel space to normalized
      // device coordinates (NDC). In NDC (0,0) is the middle,
      // (-1, 1) is the top left and (1, -1) is the bottom right.
      // Stolen from Peter Beshai's great blog post:
      // http://peterbeshai.com/beautifully-animate-points-with-webgl-and-regl.html
      vec2 normalizeCoords(vec2 position) {
        // read in the positions into x and y vars
        float x = position[0];
        float y = position[1];

        return vec2(
          2.0 * ((x / stageWidth) - 0.5),
          // invert y to treat [0,0] as bottom left in pixel space
          -(2.0 * ((y / stageHeight) - 0.5)));
      }

      void main () {
        gl_PointSize = 0.5;
        gl_Position = vec4(normalizeCoords(position), 0, 1);
      }`,

      attributes: {
        // There will be a position value for each point
        // we pass in
        position: function (context, props) {
          return props.points
        }
      },

      uniforms: {
        color: function (context, props) {
          return [Math.cos(context.tick / 100), 0.304, 1.000, 1.000];
        },
        // FYI: there is a helper method for grabbing
        // values out of the context as well.
        // These uniforms are used in our fragment shader to
        // convert our x / y values to WebGL coordinate space.
        stageWidth:  function(context, props) {
          return props.width
        },
        stageHeight:  function(context, props) {
          return props.height
        }
      },

      count: function(context, props) {
        // set the count based on the number of points we have
        return props.points.length
      },
      primitive: 'points'
    })

    this.regl.frame(context => {
      //console.log(this.$store.getters.getPoints)
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
