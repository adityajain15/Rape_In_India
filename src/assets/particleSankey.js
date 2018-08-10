import sankeyHelper from './sankeyHelper'
import SankeyLayout from '../assets/sankey'
const weightedRandom = require('weighted-random');
const fragmentShader = require('raw-loader!glslify-loader!../shaders/frag.glsl')
const vertexShader = require('raw-loader!glslify-loader!../shaders/vertex.glsl')

export default class ParticleSankey {
  constructor (reglInstance, csvData, [width, height]) {
    this.data = sankeyHelper(csvData)
    this.regl = reglInstance
    this.width = width
    this.height = height
    this.graph = new SankeyLayout()
      .nodes(this.data.nodes)
      .links(this.data.links)
      .nodeWidth(10)
      .nodePadding(40)
      .size([width - 20, height - 20])
      .layout(32)

    let numPoints = 0
    const nodes = this.graph.nodes()
    // go through all the graph nodes
    for (let i = 0; i < nodes.length; i++) {
      // select nodes that are sources
      if (!nodes[i].targetLinks.length) {
        for (let j = 0; j < nodes[i].sourceLinks.length; j++) {
          numPoints += nodes[i].sourceLinks[j].value
        }
      }
    }

    const sourceX = new Float32Array(numPoints)
    const sourceY = new Float32Array(numPoints)
    const targetX = new Float32Array(numPoints)
    const targetY = new Float32Array(numPoints)
    const duration = new Float32Array(numPoints)
    const elapsed = new Float32Array(numPoints)
    const currentPositions = []
    let startTime

    let index = 0
    for (let i = 0; i < nodes.length; i++) {
      // select nodes that are sources
      if (!nodes[i].targetLinks.length) {
        // select all links between sources and their children
        for (let j = 0; j < nodes[i].sourceLinks.length; j++) {
          const d = nodes[i].sourceLinks[j]
          for (let k = 0; k < d.value; k++, index++) {
            const x0 = d.source.x + (Math.random() * d.source.dx)
            const y0 = d.source.y + d.sy + (Math.random() * d.dy)
            const x1 = d.target.x + (Math.random() * d.target.dx)
            const y1 = d.target.y + d.ty + (Math.random() * d.dy)

            sourceX[index] = x0
            sourceY[index] = y0
            targetX[index] = x1
            targetY[index] = y1
            duration[index] = (Math.random() * 18 + 2) * 1000
            currentPositions.push(d)
          }
        }
      }
    }

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
      count: function (context, props) {
        return numPoints
      },
      primitive: 'points'
    })

    this.regl.frame(({time}) => {
      if (!startTime) {
        startTime = new Float32Array(numPoints)
        for (let i = 0; i < numPoints; i++) {
          startTime[i] = time + (Math.random() * 20)
        }
      }

      for (let i = 0; i < numPoints; i++) {
        elapsed[i] = (time - startTime[i]) * 1000
        if (elapsed[i] > duration[i] && currentPositions[i].target.sourceLinks.length) {
          // We may have multiple possibilities for our next destination. We pick one probabilistically
          const sum = currentPositions[i].target.sourceLinks.map(d => d.value).reduce((x, y) => x + y)
          const probabilities = currentPositions[i].target.sourceLinks.map(d => d.value / sum)
          const selectionIndex = weightedRandom(probabilities)
          currentPositions[i].target.sourceLinks[selectionIndex].value--
          currentPositions[i] = currentPositions[i].target.sourceLinks[selectionIndex]

          const d = currentPositions[i]
          startTime[i] = time
          elapsed[i] = (time - startTime[i]) * 1000
          sourceX[i] = targetX[i]
          sourceY[i] = targetY[i]
          targetX[i] = d.target.x + (Math.random() * d.target.dx)
          targetY[i] = d.target.y + d.ty + (Math.random() * d.dy)
        }
      }

      drawPoints({
        sourceX,
        sourceY,
        targetX,
        targetY,
        elapsed,
        duration,
        startTime,
        height: this.height,
        width: this.width,
        pointWidth: 2
      })
    })
  }
}
