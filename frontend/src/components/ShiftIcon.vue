<template>
<b-row>
  <b-col 
  cols='12' 
  v-if="isNigth(reference)" 
  class='text-center'
  v-b-tooltip.hover.bottom="getTooltipText()">
    <ModalVigilant :isPending='isPending' :reference="reference" :day='day' :isNigth='true' :place='place'/>
  </b-col>
  <b-col 
  cols='12' 
  v-if="isDay(reference)" 
  class='text-center' 
  v-b-tooltip.hover.top="getTooltipText()">
    <ModalVigilant :isPending='isPending' :reference="reference" :day='day' :isNigth='false' :place='place'/>
  </b-col>
</b-row>
</template>

<script>
import ModalVigilant from './ModalVigilant'
export default {
  name: "ShiftIcon",
  components:{
    ModalVigilant
  },
  props: ['reference', 'isPending', 'day', 'place'],
  methods:{
    getTooltipText(){
        return this.isPending ? `Click to schedule a vigilant to ${this.reference.toLowerCase()}` : `${this.nameSelected} is scheduled in ${this.reference.toLowerCase()}`
    },
    isNigth(ref){
      return (ref === 'Evening' || ref === 'Dawn')
    },
    isDay(ref){
      return !(ref === 'Evening' || ref === 'Dawn')
    }
  }
}
</script>

<style>
  b-form-select{
    width: 100%;
  }

</style>