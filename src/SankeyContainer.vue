<template>
  <div class="w-80 center">
    <ThreeSankey class="mv5" fileString="policeDisposal"/>
  </div>
</template>

<script>
import ThreeSankey from './components/ThreeSankey'
export default {
  name: 'SankeyContainer',
  components: { 
    ThreeSankey
  }
}
</script>

<style>

</style>
