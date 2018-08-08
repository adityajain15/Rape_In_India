<template>
  <ThreeSankey fileString="courtDisposal"></ThreeSankey>
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
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}
</style>
