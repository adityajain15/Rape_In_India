import sankeyHelper from './sankeyHelper'
import SankeyLayout from '../assets/sankey'
const weightedRandom = require('weighted-random');
const fragmentShader = require('raw-loader!glslify-loader!../shaders/frag.glsl')
const vertexShader = require('raw-loader!glslify-loader!../shaders/vertex.glsl')

export default class ParticleSankey {
  constructor (reglInstance, csvData, [width, height], textNodes) {
    this.data = sankeyHelper(csvData)
    this.regl = reglInstance
    this.mobile = width < 480
    this.width = width
    this.height = height
    this.graph = new SankeyLayout()
      .nodes(this.data.nodes)
      .links(this.data.links)
      .nodeWidth(this.mobile ? 4 : 10)
      .nodePadding(40)
      .size(this.mobile ? [height - 20, width - 20] : [width - 20, height - 20])
      .layout(32)
    this.nodes = this.graph.nodes()
    this.numPoints = this.getNumPoints()
    // setup buffers
    this.sourceX = new Float32Array(this.numPoints)
    this.sourceY = new Float32Array(this.numPoints)
    this.targetX = new Float32Array(this.numPoints)
    this.targetY = new Float32Array(this.numPoints)
    this.duration = new Float32Array(this.numPoints)
    this.elapsed = new Float32Array(this.numPoints)
    this.currentPositions = []
    this.startTime = undefined

    this.init()
  }

  getNodes () {
    return this.nodes
  }

  getNumPoints () {
    let numPoints = 0
    // go through all the graph nodes
    for (let i = 0; i < this.nodes.length; i++) {
      // select nodes that are sources
      if (!this.nodes[i].targetLinks.length) {
        for (let j = 0; j < this.nodes[i].sourceLinks.length; j++) {
          numPoints += this.nodes[i].sourceLinks[j].value
        }
      }
    }
    return numPoints
  }

  init () {
    // setup initial positions for all the points
    this.initialPositions()

    const drawPoints = this.regl({
      frag: fragmentShader,
      vert: vertexShader,
      attributes: {
        sourceX: this.regl.prop('sourceX'),
        sourceY: this.regl.prop('sourceY'),
        targetX: this.regl.prop('targetX'),
        targetY: this.regl.prop('targetY'),
        elapsed: this.regl.prop('elapsed'),
        duration: this.regl.prop('duration')
      },
      uniforms: {
        color: function (context, props) {
          return [1.00, 0.001, 0.001, 1.000]
        },
        stageWidth: function (context, props) {
          return props.width
        },
        stageHeight: function (context, props) {
          return props.height
        },
        pointWidth: function (context, props) {
          return props.pointWidth
        }
      },
      count: this.numPoints,
      primitive: 'points'
    })

    this.regl.frame(({time}) => {
      const height = this.mobile ? this.width : this.height
      if (!this.startTime) {
        this.startTime = new Float32Array(this.numPoints)
        for (let i = 0; i < this.numPoints; i++) {
          this.startTime[i] = time + (Math.random() * 20)
        }
      }

      for (let i = 0; i < this.numPoints; i++) {
        this.elapsed[i] = (time - this.startTime[i]) * 1000
        if (this.elapsed[i] > this.duration[i] && this.currentPositions[i].target.sourceLinks.length) {
          // We may have multiple possibilities for our next destination. We pick one probabilistically
          const sum = this.currentPositions[i].target.sourceLinks.map(d => d.value).reduce((x, y) => x + y)
          const probabilities = this.currentPositions[i].target.sourceLinks.map(d => d.value / sum)
          const selectionIndex = weightedRandom(probabilities)
          this.currentPositions[i].target.sourceLinks[selectionIndex].value--
          this.currentPositions[i] = this.currentPositions[i].target.sourceLinks[selectionIndex]

          const d = this.currentPositions[i]
          this.startTime[i] = time
          this.elapsed[i] = (time - this.startTime[i]) * 1000
          this.sourceX[i] = this.targetX[i]
          this.sourceY[i] = this.targetY[i]
          this.targetX[i] = this.mobile ? (d.target.y + d.ty + (Math.random() * d.dy)) : d.target.x + (Math.random() * d.target.dx)
          this.targetY[i] = this.mobile ? (d.target.x + (Math.random() * d.target.dx)) : d.target.y + d.ty + (Math.random() * d.dy)
        }
      }

      drawPoints({
        sourceX: this.sourceX,
        sourceY: this.sourceY,
        targetX: this.targetX,
        targetY: this.targetY,
        elapsed: this.elapsed,
        duration: this.duration,
        startTime: this.startTime,
        height: this.height,
        width: this.width,
        pointWidth: 3
      })
    })
  }

  initialPositions () {
    let index = 0
    for (let i = 0; i < this.nodes.length; i++) {
      // select nodes that are sources
      if (!this.nodes[i].targetLinks.length) {
        // select all links between sources and their children
        for (let j = 0; j < this.nodes[i].sourceLinks.length; j++) {
          const d = this.nodes[i].sourceLinks[j]
          for (let k = 0; k < d.value; k++, index++) {
            //d.source.x + d.sy + d.dy / 2
            const x0 = this.mobile ? d.source.y + d.sy + (Math.random() * d.dy) : d.source.x + (Math.random() * d.source.dx)
            const y0 = this.mobile ? d.source.x + (Math.random() * d.source.dx) : d.source.y + d.sy + (Math.random() * d.dy)
            const x1 = this.mobile ? d.target.y + d.ty + (Math.random() * d.dy) : d.target.x + (Math.random() * d.target.dx)
            const y1 = this.mobile ? d.target.x + (Math.random() * d.target.dx) : d.target.y + d.ty + (Math.random() * d.dy)

            this.sourceX[index] = x0
            this.sourceY[index] = y0
            this.targetX[index] = x1
            this.targetY[index] = y1
            this.duration[index] = ((Math.random() * 18) + 2) * 1000
            this.currentPositions.push(d)
          }
        }
      }
    }
  }
}
