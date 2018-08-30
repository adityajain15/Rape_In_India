<template>
  <div class="db w-90 center">
    <div class="db w-90 w-50-ns center mv5">
      <TreeMap class="w-100 vh-50" :treeData="treeData[treeData.length - 1]" :styleFunction="styleFunction"/>
      <h3 class="tc f3 mt2 teko white">Offenders relation to victims of Rape</h3>
    </div>
    <template v-for="(record, index) in treeData">
      <div v-if="index !== (treeData.length - 1)" class="dib w-third w-25-ns mv3 v-top">
        <TreeMap class="w-100 h4 vh-25-ns" :treeData="record" :styleFunction="styleFunction"/>
        <h5 class="tc f4 teko white">{{record.name}}</h5>
      </div>
    </template>
  </div>
</template>

<script>
import { csv as d3csv } from 'd3-fetch'
import { scaleOrdinal } from 'd3-scale'
import { schemeSet1 } from 'd3-scale-chromatic'
import TreeMap from './components/TreeMap'

export default {
  name: 'Relation',
  components: {
    TreeMap
  },
  data () {
    return {
      treeData: {},
      scale: scaleOrdinal().range(schemeSet1)
    }
  },
  computed: {
  
  },
  methods: {
    styleFunction (record) {
      if (record.data.hasOwnProperty('name')) {
        return {
          fill: this.scale(record.data.name)
        }
      }
      return {
        fill: 'red'
      }
    }
  },
  async created () {
    try {
      this.treeData = await d3csv('relation.csv')
      this.treeData = this.treeData.map(d=>{
        return {
          name: d['Name'],
          children: [
            {
              name: 'Known to victims',
              children: [
                {
                  name: 'Partner / Husband / Separated/ Ex',
                  value: parseInt(d['Partner / Husband / Separated/ Ex'])
                },
                {
                  name: 'Employer/Coworker',
                  value: parseInt(d['Employer/Coworker'])
                },
                {
                  name: 'Other known persons',
                  value: parseInt(d['Other known persons'])
                },
                {
                  name: 'Known persons on promise to marry the victim',
                  value: parseInt(d['Known persons on promise to marry the victim'])
                },
                {
                  name: 'Neighbors',
                  value: parseInt(d['Neighbors'])
                },
                {
                  name: 'Relatives',
                  value: parseInt(d['Relatives'])
                },
                {
                  name: 'Close Family Members',
                  value: parseInt(d['Close Family Members'])
                },
                {
                  name: 'Grand Father/ Father/ Brother/ Son',
                  value: parseInt(d['Grand Father/ Father/ Brother/ Son'])
                }
              ]
            },
            {
              name: 'Offenders not known to victims',
              value: parseInt(d['Offenders not known to victims'])
            }
          ]
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>

</style>
