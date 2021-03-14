<template>
  <b-row>
    <b-col cols='12'>
      <b-button v-b-modal="`modal-${day}-${reference}-${place.name}`"><i v-bind:class="{'text-danger': isPendingComputed, 'fa-sun' : !isNigth}" class="fas fa-moon text-success dayIcon"></i></b-button>
      <b-modal 
      :id="`modal-${day}-${reference}-${place.name}`" 
      :title="`Schedule a vigilant to ${this.reference} - ${this.place.name}`"
      @ok="handleClick">
        <b-form-select v-model="selected" :options="options"></b-form-select>
      </b-modal>
    </b-col>
    <b-col cols='12'>
      <small class='text-success referenceIcon' v-bind:class="{'text-danger': isPendingComputed}">{{nameSelected}}</small>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'ModalVigilant',
  props:['isPending', 'reference', 'day', 'isNigth', 'place'],
  data(){
    return {
      selected: null,
      options: this.getOptions(),
      nameSelected: this.reference  
    }
  },
  computed:{
    isPendingComputed(){
      return this.selected == null && this.isPending === true
    }
  },
  methods:{
    refreshNameSelected(){
      if(this.selected != null){
        this.nameSelected = this.$store.getters.getVigilantByID(this.selected)['name'].split(" ")[0]
      }else{
        this.nameSelected = this.reference
      }
      return this.nameSelected
    },
    getOptions(){
      let options = []
      options.push({
        value: null,
        text: 'Not scheduled'
      })
      this.$store.state.vigilants.map(each =>{
        options.push({
          value: each._id,
          text: each.name 
        })
      })
      return options
    },
    async handleClick(){
      let payload = {
        _id: this.$store.getters.getShiftByDayAndRef({day:this.day, ref:this.reference})['_id'],
        vigilantID: this.selected
      }
      this.$store.dispatch("scheduleAVigilant", payload)
      this.refreshNameSelected()
    },
  },
  created(){
    if(!this.isPendingComputed){
      let shift = this.$store.getters.getShiftByDayAndRef({day: this.day, ref: this.reference})
      this.selected = shift.vigilantID
      console.log("Select name: " + this.nameSelected)
      this.refreshNameSelected()
    }
  }
}
</script>

<style scooped>
  .dayIcon{
    font-size:20px;
  }
  .referenceIcon{
    font-size:14px;
  }

</style>