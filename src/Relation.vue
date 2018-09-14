<template>
  <div class="db w-90 center">
    <div class="db w-90 w-50-ns center mv5">
      <TreeMap class="w-100" :style="`height: ${windowHeight * .5}`" :containerHeight="windowHeight * .5" :treeData="treeData[treeData.length - 1]" :styleFunction="styleFunction"/>
      <template v-for="label of scale.domain()">
        <span class="dib ma1 pa1 teko black" :style="`background: ${scale(label)}`">{{label}}</span>
      </template>
      <h3 class="tc f3 mt2 teko white">Offenders relation to victims of Rape across India</h3>
    </div>
    <template v-for="(record, index) in treeData">
      <div v-if="index !== (treeData.length - 1)" class="dib w-third w-ninth-ns mv3 v-top">
        <TreeMap class="w-100" :style="`height: ${windowHeight * .15}`" :containerHeight="windowHeight * .15" :treeData="record" :styleFunction="styleFunction"/>
        <h5 class="tc f4 teko white mt1">{{record.name}}</h5>
      </div>
    </template>
  </div>
</template>

<script>
import { csv as d3csv } from 'd3-fetch'
import { scaleOrdinal } from 'd3-scale'
import { schemeSet1 } from 'd3-scale-chromatic'
import LegendOrdinal from './components/LegendOrdinal'
import TreeMap from './components/TreeMap'

export default {
  name: 'Relation',
  components: {
    TreeMap,
    LegendOrdinal
  },
  data () {
    return {
      treeData: {},
      windowHeight: 0,
      scale: scaleOrdinal().domain(["Grand Father/ Father/ Brother/ Son","Close Family Members", "Relatives","Partner / Husband / Separated/ Ex", "Employer/Coworker", "Neighbors","Known persons on promise to marry the victim","Other known persons","Offenders not known to victims"]).range(schemeSet1),
    }
  },
  mounted () {
    this.windowHeight = window.innerHeight
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

<style>
@media screen and (min-width: 30em) {
  .w-twelfth-ns{
    width: calc(100% / 12);
  }
  .w-ninth-ns{
    width: calc(100% / 9);
  }
  .vh-15-ns{
    height: 15vh;
  }
}
</style>
