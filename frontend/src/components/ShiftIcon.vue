<template>
  <b-row>
    <b-col
      cols="12"
      class="text-center"
    >
      <b-overlay
        :show="isLoading"
        :variant="'dark'"
        :bg-color="'transparent'"
        :spinner-variant="'light'"
        :blur="'5px'"
        :opacity="'0.9'"
        :spinner-small='true'
      >
        <ModalVigilant
          :isPending="isReallyPending"
          :reference="reference"
          :day="day"
          :place="place"
          :shift="shift"
          :past='past'
          @setLoading="setLoading"
        />
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import ModalVigilant from "./ModalVigilant";
export default {
  name: "ShiftIcon",
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    ModalVigilant,
  },
  props: ["reference", "isPending", "day", "place", "shift", 'past'],
  computed:{
    isReallyPending(){
      return this.isPending && this.$store.getters.getVigilantByID(this.shift.vigilantID) === undefined
    }
  },
  methods: {  
    setLoading(value) {
      this.isLoading = value;
    },
    isNigth(ref) {
      return ref === "Evening" || ref === "Dawn";
    },
    isDay(ref) {
      return !(ref === "Evening" || ref === "Dawn");
    },
  },
};
</script>

<style>
  b-form-select {
    width: 100%;
  }

  b-overlay{
    max-height: 30px;
  }
</style>
