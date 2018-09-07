<template>
  <div class="db w-90 center">
    <template v-for="record in records">
      <div class="w-third w-25-ns dib pa2 mv3 white teko v-top">
        <Stats :record="record"/>
        <span class="db tc f4">{{record.State}}</span>
      </div>
    </template>
  </div>
</template>

<script>
import { csv as d3csv } from 'd3-fetch'
import Stats from './components/Stats'

export default {
  name: 'SankeyMultiples',
  components: {
    Stats
  },
  data () {
    return {
      records: []
    }
  },
  async mounted () {
    this.records = await d3csv('out.csv')
  }
}
</script>

<style>

</style>
