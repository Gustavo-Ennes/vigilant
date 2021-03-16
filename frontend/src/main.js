// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { BootstrapVue,BootstrapVueIcons } from 'bootstrap-vue'
import Vuex from 'vuex'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/global.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isScheduling: false,
    schedulingShiftID: null,
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
      let shift = state.shifts.find(
        shift => (
          shift.reference === payload.ref
          && shift.day === payload.day
          && shift.placeID === payload.placeID
        )
      )
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
    setScheduling(state){
      state.isScheduling = true
    },
    unsetScheduling(state){
      state.isScheduling = false
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
    setSchedulingShiftID(state, id){
      state.schedulingShiftID = id
    }
  },
  actions: {
    async scheduleAVigilant({commit, dispatch, getters}, payload){
      commit("setScheduling")

      await fetch(`${getters.getURL()}/shifts/?_id=${payload._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      console.log(`Vigilant ${payload.vigilantID} scheduled.`)
      await dispatch('fetchShifts', {active: false, setLoading: false})
      await dispatch('fetchShifts', {active: true, setLoading: false})
      commit('unsetScheduling')

    },
    async addPlace({dispatch, getters}, payload){ 
      await fetch(`${getters.getURL()}/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      await dispatch("fetchPlaces", false)
      await dispatch('fetchShifts', {active: true, setLoading: false})      
      await dispatch("fetchItineraries", {active: true, setLoading: false})
    },
    async addVigilant({dispatch, getters}, payload){ 
      await fetch(`${getters.getURL()}/vigilant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      await dispatch("fetchVigilants", false)      
      await dispatch("fetchItineraries", {active: true, setLoading: false})
    },
    async fetchVigilants({commit, getters}, setLoading){
      let res = null

      if(setLoading){
        commit('setLoading')
        commit('setLoadingLabel', 'vigilants')
      }

      res = await fetch(getters.getURL()  + '/vigilant')
      res = await res.json()
      commit("set", {type: 'v', object: res.vigilants})

      if(setLoading){
        commit("unsetLoading")
      }
    },
    async fetchPlaces({commit, getters}, setLoading){
      let res = null

      if(setLoading){
        commit('setLoading')
        commit('setLoadingLabel', 'places')
      }
      res = await fetch(getters.getURL()  + '/place')
      res = await res.json()
      commit("set", {type: 'p', object: res.places})
      if(setLoading){
        commit("unsetLoading")
      }
    },
    async fetchItineraries({commit, getters}, payload){
      let res = null

      if(payload.setLoading){
        commit('setLoading')
      }

      if(payload.active === true){
        if(payload.setLoading){
          commit('setLoadingLabel', 'active itinerary')
        }
        res = await fetch(getters.getURL()  + '/itinerary/active')
        res = await res.json()
        commit("set", {type: 'ai', object: res.activeItinerary})  
      }else{
        if(payload.setLoading){
          commit('setLoadingLabel', 'itineraries')
        }
        res = await fetch(getters.getURL()  + '/itinerary')
        res = await res.json()
        commit("set", {type: 'i', object: res.itineraries})
      }
      if(payload.setLoading){
        commit("unsetLoading")
      }
    },
    async fetchShifts({commit, getters}, payload){
      let res = null

      if(payload.setLoading){
        commit('setLoading')
      }
      if(payload.active === true){
        if(payload.setLoading){
          commit('setLoadingLabel', 'active shifts')
        }
        res = await fetch(`${getters.getURL()}/shifts/?active=true`)
        res = await res.json()
        commit("set", {type: 'as', object: res.shifts})   
      }else{
        if(payload.setLoading){
          commit('setLoadingLabel', 'shifts')
        }
        res = await fetch(getters.getURL()  + '/shifts')
        res = await res.json()
        commit("set", {type: 's', object: res.shifts})
      }
      if(payload.setLoading){
        commit("unsetLoading")
      }
    },
    async fetchAPI({dispatch}){
      await dispatch('fetchVigilants', true)
      await dispatch('fetchPlaces', true)
      await dispatch('fetchItineraries', {active: false, setLoading: true})
      await dispatch('fetchItineraries', {active: true, setLoading: true})
      await dispatch('fetchShifts', {active: false, setLoading: true})
      await dispatch('fetchShifts', {active: true, setLoading: true})
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
