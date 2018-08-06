<template>
  <canvas id="drawingBoard"/>
</template>

<script>
import store from '../store'
import d3sankey from '../assets/sankey'
import sankeyHelper from '../assets/sankeyHelper'
import { csv as d3csv } from 'd3-fetch'
import { scaleLinear } from 'd3-scale'
const debounce = require('lodash.debounce')
const THREE = require('three')

export default {
  name: 'ThreeSankey',
  store,
  data () {
    return {
      width: 500,
      height: 200,
      scene: new THREE.Scene(),
      renderer: undefined,
      camera: undefined,
      graph: undefined,
      sankey: d3sankey()
    }
  },
  props: ['fileString'],
  async mounted () {
    this.resizeFunc()
    window.addEventListener('resize', debounce(this.resizeFunc, 60))
    
    if (this.fileString) {
      const data = await d3csv(`${this.fileString}.csv`)
      this.graph = sankeyHelper(data)
      this.sankey
        .nodes(this.graph.nodes)
        .links(this.graph.links)
        .nodeWidth(5)
        .nodePadding(20)
        .size([this.width - 20, this.height - 20])
        .layout(32)
    }

    for(let i=0;i<this.graph.nodes.length;i++) {

      var rectGeometry = new THREE.Geometry()
      rectGeometry.vertices.push(new THREE.Vector3(0, 0,0))
      rectGeometry.vertices.push(new THREE.Vector3(this.graph.nodes[i].dx, 0,0))
      rectGeometry.vertices.push(new THREE.Vector3(this.graph.nodes[i].dx, this.graph.nodes[i].dy < 1 ? 1 : this.graph.nodes[i].dy,0))
      rectGeometry.vertices.push(new THREE.Vector3(0, this.graph.nodes[i].dy < 1 ? 1 : this.graph.nodes[i].dy, 0))
      rectGeometry.faces.push(new THREE.Face3(0, 1, 2))
      rectGeometry.faces.push(new THREE.Face3(0, 2, 3))
      var rectMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
      })
      var rectMesh = new THREE.Mesh(rectGeometry, rectMaterial)
      rectMesh.position.set(this.graph.nodes[i].x - this.width/2 + 10 , this.graph.nodes[i].y - this.height / 2 + 10 , 0)
      this.scene.add(rectMesh)
    }

    for(let i = 0; i < this.graph.nodes.length; i++) {
      if (!this.graph.nodes[i].targetLinks.length) {
        //this.sankey.link(this.graph.links[i], this.graph.links[i].value, this.scene)
        for(let j = 0; j < this.graph.nodes[i].sourceLinks.length; j++) {
          this.sankey.link(this.graph.nodes[i].sourceLinks[j], this.graph.nodes[i].sourceLinks[j].value, this.scene)
        }
      }
    }
    
    this.animate()
  },
  methods: {
    resizeFunc () {
      
      this.camera = new THREE.PerspectiveCamera( 70, this.$el.clientWidth / this.$el.clientHeight, 11, 410 )
      this.renderer = new THREE.WebGLRenderer({canvas: this.$el, antialias: true})
      this.renderer.setSize(this.$el.clientWidth, this.$el.clientHeight)
      this.camera.position.z = 250;

      const vFOV = THREE.Math.degToRad(this.camera.fov)
      this.height = 2 * Math.tan( vFOV / 2 ) * this.camera.position.z
      this.width = this.height * this.camera.aspect
      
    },
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render( this.scene, this.camera )
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
