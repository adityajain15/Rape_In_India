<template>
  <div class="w-90 center">
    <ThreeSankey class="mv5" fileString="policeDisposal"/>
    <ThreeSankey class="mv5" fileString="courtDisposal"/>
  </div>
</template>

<script>
import ThreeSankey from './components/ThreeSankey'
export default {
  name: 'app',
  components: { ThreeSankey }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Helvetica, sans-serif;
  color: #2c3e50;
}
</style>
