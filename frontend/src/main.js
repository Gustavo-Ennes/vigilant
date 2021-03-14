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
    isLoading: false,
    debug:true,
    vigilants: [],
    places: [],
    itineraries: [],
    loadingLabel: '',
    activeItinerary: {},
    shifts: [],
    activeShifts: []
  },
  getters: {
    getURL: (state) => () => {
      return state.debug === true ? "http://localhost:5000/api" : "https://vigilant.herokuapp.com/api"
    },
    getVigilantByID: (state) => (id) => {
      return state.vigilants.find(v => v._id === id)
    },
    getShiftByDayAndRef: (state) => (payload) => {
      let shift = state.shifts.find(shift => (shift.reference === payload.ref && shift.day === payload.day))
      return shift
    }
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
    async scheduleAVigilant({commit, dispatch, getters}, payload){
      commit("setLoading")
      await fetch(`${getters.getURL()}/shifts/?_id=${payload._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      console.log(`Vigilant ${payload.vigilantID} scheduled.`)

    },
    async fetchVigilants({commit, getters}){
      let res = null
      commit('setLoading')
      commit('setLoadingLabel', 'vigilants')
      res = await fetch(getters.getURL()  + '/vigilant')
      res = await res.json()
      commit("set", {type: 'v', object: res.vigilants})
      commit("unsetLoading")
    },
    async fetchPlaces({commit, getters}){
      let res = null
      commit('setLoading')
      commit('setLoadingLabel', 'places')
      res = await fetch(getters.getURL()  + '/place')
      res = await res.json()
      commit("set", {type: 'p', object: res.places})
      commit("unsetLoading")
    },
    async fetchItineraries({commit, getters}, active){
      let res = null
      commit('setLoading')

      if(active === true){
        commit('setLoadingLabel', 'active itinerary')
        res = await fetch(getters.getURL()  + '/itinerary/active')
        res = await res.json()
        commit("set", {type: 'ai', object: res.activeItinerary})  
      }else{
        commit('setLoadingLabel', 'itineraries')
        res = await fetch(getters.getURL()  + '/itinerary')
        res = await res.json()
        commit("set", {type: 'i', object: res.itineraries})
      }
      commit("unsetLoading")
    },
    async fetchShifts({commit, getters}, active){

      let res = null
      commit('setLoading')
      if(active === true){
        commit('setLoadingLabel', 'active shifts')
        res = await fetch(`${getters.getURL()}/shifts/?active=${true}`)
        res = await res.json()
        commit("set", {type: 'as', object: res.shifts})   
      }else{
        commit('setLoadingLabel', 'shifts')
        res = await fetch(getters.getURL()  + '/shifts')
        res = await res.json()
        commit("set", {type: 's', object: res.shifts})
      }
      commit("unsetLoading")
    },
    async fetchAPI({dispatch}){
      await dispatch('fetchVigilants')
      await dispatch('fetchPlaces')
      await dispatch('fetchItineraries', false)
      await dispatch('fetchItineraries', true)
      await dispatch('fetchShifts', false)
      await dispatch('fetchShifts', true)
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
