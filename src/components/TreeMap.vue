<template>
  <svg>
    <template v-for="node in nodes">
      <rect v-if="node.hasOwnProperty('x0')" :x="marginLeft + node.x0" :y="marginTop + node.y0" :width="node.x1 - node.x0" :height="node.y1 - node.y0" :style="styleFunction(node)"/>
    </template>
  </svg>
</template>

<script>
const debounce = require('lodash.debounce')
import { hierarchy, treemap, treemapSliceDice } from 'd3-hierarchy'

export default {
  name: 'TreeMap',
  props: {
    treeData: {
      type: Object,
      default: function () {
        return {}
      },
      required: true
    },
    margin: {
      type: Array,
      default: function () {
        return [0, 5, 0, 5]
      }
    },
    marginTop: {
      type: Number,
      default: function () {
        return this.margin[0]
      }
    },
    marginRight: {
      type: Number,
      default: function () {
        return this.margin[1]
      }
    },
    marginBottom: {
      type: Number,
      default: function () {
        return this.margin[2]
      }
    },
    marginLeft: {
      type: Number,
      default: function () {
        return this.margin[3]
      }
    },
    styleFunction: {
      default: function () {
        return function (record) {
          return {
            fill: 'red'
          }
        }
      }
    }
  },
  data () {
    return {
      width: 400,
      height: 400,
      root: hierarchy({}),
      nodes: []
    }
  },
  mounted () {
    this.resizeWindow()
    window.addEventListener('resize', debounce(this.resizeWindow, 60))
  },
  watch: {
    treeData: function (newVal, oldVal) {
      this.root = hierarchy(newVal)
        .sum(function(d) {
          return d.value
        })
      this.layout(this.root)
      this.nodes = this.root.leaves()
    },
    width: function (newVal, oldVal) {
      this.root = hierarchy(this.treeData)
        .sum(function(d) {
          return d.value
        })
      this.layout(this.root)
      this.nodes = this.root.leaves()
    }
  },
  methods: {
    resizeWindow () {
      this.width = this.$el.clientWidth - this.marginRight - this.marginLeft
      this.height = this.$el.clientHeight - this.marginTop - this.marginBottom
    }
  },
  computed: {
    layout () {
      return treemap()
        .size([this.width, this.height])
        .tile(treemapSliceDice)
        .padding(0)
    }
  }
}
</script>

<style scoped>

</style>
