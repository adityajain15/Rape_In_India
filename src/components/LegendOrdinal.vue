<template>
  <div>
    <template v-for="label in labels">
      <span :style="`fill: ${scale(label)}`">{{label}}</span>
    </template>
  </div>
</template>

<script>
const debounce = require('lodash.debounce')

export default {
  name: 'LegendOrdinal',
  props: {
    scale: {
      type: Function
    },
    labels: {
      type: Array,
      default: []
    }
  }
}
</script>

<style scoped>
span{
  color:white;
}
</style>