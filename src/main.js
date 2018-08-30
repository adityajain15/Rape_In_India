import Vue from 'vue'
import SankeyContainer from './SankeyContainer.vue'
import MapNumber from './MapNumber.vue'
import MapRate from './MapRate.vue'
import Age from './Age.vue'
import Relation from './Relation.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(SankeyContainer)
}).$mount('#sankey')

new Vue({
  store,
  render: h => h(MapNumber)
}).$mount('#mapNumber')

new Vue({
  render: h => h(MapRate)
}).$mount('#mapRate')

new Vue({
  render: h => h(Age)
}).$mount('#age')

new Vue({
  render: h => h(Relation)
}).$mount('#relation')
