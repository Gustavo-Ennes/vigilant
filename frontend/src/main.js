// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Vuex from "vuex";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    debug: true,
    isScheduling: false,
    schedulingShiftID: null,
    isLoading: false,
    isAComponentLoading: false,
    loadingComponent: null,
    vigilants: [],
    places: [],
    itineraries: [],
    loadingLabel: "",
    activeItinerary: {},
    shifts: [],
    activeShifts: [],
    shiftLabelHover: null,
    referenceNumbers: {
      'Dawn': "01",
      'Morning': "02",
      'Afternoon': '03',  
      'Evening': '04'
    }
  },
  getters: {    
    referenceNumber: (state) => (ref) => {      
      return state.referenceNumbers[ref]
    },
    getURL: (state) => () => {
      return state.debug === true
        ? "http://localhost:5000/api"
        : "https://vigilant.herokuapp.com/api";
    },
    getVigilantByID: (state) => (id) => {
      return state.vigilants.find((v) => v._id === id);
    },
    getShiftByDayAndRef: (state) => (payload) => {
      let shift = state.shifts.find(
        (shift) =>
          shift.reference === payload.ref &&
          shift.day === payload.day &&
          shift.placeID === payload.placeID
      );
      return shift;
    }
  },
  mutations: {
    set(state, payload) {
      switch (payload.type) {
        case "i":
          state.itineraries = payload.object;
          break;
        case "p":
          state.places = payload.object;
          break;
        case "v":
          state.vigilants = payload.object;
          break;
        case "s":
          state.shifts = payload.object;
          break;
        case "ai":
          state.activeItinerary = payload.object;
          break;
        case "as":
          state.activeShifts = payload.object;
          break;
        case 'u':
          state.user = payload.object
          break;
      }
    },
    setShiftLabelHovering(state, reference){
      switch(reference){
        case 'Dawn':
          state.shiftLabelHover = '01'
          break
        case "Morning":
          state.shiftLabelHover = '02'
          break
        case "Afternoon":
          state.shiftLabelHover = '03'
          break
        case "Evening":
          state.shiftLabelHover = '04'
          break
        default:break
      }
    },
    unsetShiftLabelHovering(state){
      state.shiftLabelHover = null
    },
    unsetComponentLoading(state){
      state.isAComponentLoading = false
    },
    setComponentLoading(state){
      state.isAComponentLoading = true
    },
    setLoadingComponentName(state, label){
      state.loadingComponent = label
    },
    setScheduling(state) {
      state.isScheduling = true;
    },
    unsetScheduling(state) {
      state.isScheduling = false;
    },
    setLoading(state) {
      state.isLoading = true;
    },
    unsetLoading(state) {
      state.isLoading = false;
    },
    setLoadingLabel(state, label) {
      state.loadingLabel = label;
    },
    setSchedulingShiftID(state, id) {
      state.schedulingShiftID = id;
    },
  },
  actions: {
    async scheduleAVigilant({ commit, dispatch, getters }, payload) {
      commit("setScheduling");
      commit("setLoadingLabel", "the vigilant scheduling");

      await fetch(`${getters.getURL()}/shifts/?_id=${payload._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      console.log(`Vigilant ${payload.vigilantID} scheduled.`);
      await dispatch("fetchShifts", { active: false, setLoading: false });
      await dispatch("fetchShifts", { active: true, setLoading: false });
      commit("unsetScheduling");
    },
    async addPlace({ dispatch, getters, commit }, payload) {
      commit('setLoadingLabel', `Creating ${payload.name} shifts...`)
      commit("setLoadingComponentName", 'place')
      commit("setComponentLoading")
      await fetch(`${getters.getURL()}/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      commit("setLoadingComponentName", 'calendar')
      await dispatch('fetchAPI')
      commit("unsetComponentLoading")
    },
    async addVigilant({ dispatch, getters, commit }, payload) {
      commit("setLoadingLabel", "a vigilant creator");
      commit("setLoadingComponentName", 'vigilant')
      commit("setComponentLoading")
      await fetch(`${getters.getURL()}/vigilant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      commit("setLoadingComponentName", 'calendar')
      await dispatch("fetchVigilants", false);
      await dispatch("fetchItineraries", true);
      commit("unsetComponentLoading")
    },
    async deletePlace({commit, getters, dispatch}, id){ 
      commit("setLoadingLabel", "deleting a place");
      commit("setLoadingComponentName", 'place')
      commit("setComponentLoading")
      await fetch(`${getters.getURL()}/place/?_id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        }
      });
      commit("setLoadingComponentName", 'calendar')
      await dispatch('fetchAPI')
      commit("unsetComponentLoading")
    },
    async deleteVigilant({commit, getters, dispatch}, id){
      commit("setLoadingLabel", "deleting a vigilant");
      commit("setLoadingComponentName", 'vigilant')
      commit("setComponentLoading")
      await fetch(`${getters.getURL()}/vigilant/?_id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        }
      });
      commit("setLoadingComponentName", 'calendar')
      await dispatch('fetchAPI')
      commit("unsetComponentLoading")
    },
    async fetchUser({commit, getters}, payload){
      let res = await fetch(`${getters.getURL()}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      let content = await res.json()
      console.log("fetchUser === " + JSON.stringify(content))
      commit('set', {type:'u', object: content.user})
      return content
    },
    async logOut({commit,getters}){
      await fetch(`${getters.getURL()}/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      commit("set", {type: 'u', object: null})
    },
    async fetchVigilants({ commit, getters }) {
      commit("setLoadingLabel", "the vigilant scheduler");
      let res = null;
      res = await fetch(getters.getURL() + "/vigilant");
      res = await res.json();
      commit("set", { type: "v", object: res.vigilants });
    },
    async fetchPlaces({ commit, getters }) {
      commit("setLoadingLabel", "the list of places");
      let res = null;

      res = await fetch(getters.getURL() + "/place");
      res = await res.json();
      commit("set", { type: "p", object: res.places });
    },
    async fetchItineraries({ commit, getters }, active) {
      let res = null;

      if (active === true) {
        commit("setLoadingLabel", "this month itinerary");
        res = await fetch(getters.getURL() + "/itinerary/active");
        res = await res.json();
        commit("set", { type: "ai", object: res.activeItinerary });
      } else {
        commit("setLoadingLabel", "the folder of itineraries");
        res = await fetch(getters.getURL() + "/itinerary");
        res = await res.json();
        commit("set", { type: "i", object: res.itineraries });
      }
    },
    async fetchShifts({ commit, getters }, active) {
      let res = null;

      if (active === true) {
        commit("setLoadingLabel", "this month shifts");
        res = await fetch(`${getters.getURL()}/shifts/?active=true`);
        res = await res.json();
        commit("set", { type: "as", object: res.shifts });
      } else {
        commit("setLoadingLabel", "all shifts stuff");
        res = await fetch(getters.getURL() + "/shifts");
        res = await res.json();
        commit("set", { type: "s", object: res.shifts });
      }
    },
    async fetchAPI({ dispatch }) {
      await dispatch("fetchVigilants");
      await dispatch("fetchPlaces");
      await dispatch("fetchItineraries", false);
      await dispatch("fetchItineraries", true);
      await dispatch("fetchShifts", false);
      await dispatch("fetchShifts", true);
    },
  },
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  // template: '<App/>',
  render(h) {
    return h("App");
  },
  store: store,
});
