// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { BootstrapVue } from 'bootstrap-vue'
import Vuex from 'vuex'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/global.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    vigilants: [],
    places: [],
    itineraries: [],
    isLoading: false,
    loadingLabel: '',
    activeItinerary: {},
    shifts: [],
    activeShifts: []
  },
  mutations: {
    set(state, payload){
      switch(payload.type){
        case 'i':
          state.itineraries = payload.object
          break
        case 'p':
          state.places = payload.object
          break
        case 'v':
          state.vigilants = payload.object
          break
        case 's':
          state.shifts = payload.object
          break
        case 'ai':
          state.activeItinerary = payload.object
          break
        case 'as':
          state.activeShifts = payload.object
          break
      }
    },
    setLoading(state){
      state.isLoading = true
    },
    unsetLoading(state){
      state.isLoading = false
    },
    setLoadingLabel(state, label){
      state.loadingLabel = label
    },
  },
  actions: {
    async fetchAPI({commit}, url){
      let res = null

      commit('setLoading')

      commit('setLoadingLabel', 'shifts')
      res = await fetch(url  + '/shifts')
      console.log("RES: " + res)
      res = await res.json()
      commit("set", {type: 's', object: res.shifts})

      commit('setLoadingLabel', 'vigilants')
      res = await fetch(url  + '/vigilant')
      res = await res.json()
      commit("set", {type: 'v', object: res.vigilants})
      

      commit('setLoadingLabel', 'itineraries')
      res = await fetch(url  + '/itinerary')
      res = await res.json()
      commit("set", {type: 'i', object: res.itineraries})
      

      commit('setLoadingLabel', 'places')
      res = await fetch(url  + '/place')
      res = await res.json()
      commit("set", {type: 'p', object: res.places})
      

      commit('setLoadingLabel', 'active itinerary')
      res = await fetch(url  + '/itinerary/active')
      res = await res.json()
      commit("set", {type: 'ai', object: res.activeItinerary})  
      

      commit('setLoadingLabel', 'active shifts')
      res = await fetch(`${url}/shifts/?active=${true}`)
      res = await res.json()
      commit("set", {type: 'as', object: res.shifts})   
      
      commit("unsetLoading")
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store: store
})
