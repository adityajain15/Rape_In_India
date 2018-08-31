<template>
  <div>
    
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