<template>
  <div class="step w-80 center">
    <ThreeSankey class="mv5" fileString="policeDisposal" :style="`height: ${windowHeight * 0.9}px;`" :containerHeight="windowHeight * .9"/>
  </div>
</template>

<script>
import ThreeSankey from './components/ThreeSankey'


export default {
  name: 'SankeyContainer',
  components: { 
    ThreeSankey
  },
  data () {
    return {
      windowHeight: 0
    }
  },
  mounted () {
    this.windowHeight = window.innerHeight
  }
}
</script>