<template>
  <div id="app">
    <Dashboard :url="getURL()"/>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
export default {
  name: 'App',
  components:{
    Dashboard
  },
  data(){
    return{
      debug: true
    }
  },
  methods:{
    getURL(){
      return this.debug === true ? "http://localhost:5000/api" : "https://vigilant.herokuapp.com/api"
    },
  },
}
</script>

