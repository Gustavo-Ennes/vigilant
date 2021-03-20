<template>
  <b-row>
    <b-col
      cols="12"
      class="text-center"
      v-b-tooltip.hover.bottom="getTooltipText"
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
          @setLoading="setLoading"
          v-b-hover="hoverHandle"
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
  props: ["reference", "isPending", "day", "place", "shift"],
  computed:{
    isReallyPending(){
      return this.isPending && this.$store.getters.getVigilantByID(this.shift.vigilantID) === undefined
    },
    getTooltipText() {
      return this.isReallyPending
        ? `Click to schedule a vigilant to ${this.reference.toLowerCase()}`
        : `${this.getNameOfAVigilantByID(
            this.shift.vigilantID
          )} is scheduled in ${this.reference.toLowerCase()}`;
    },
  },
  methods: {
    hoverHandle(isHovered){
      if(isHovered){
        this.$store.commit("setShiftLabelHovering", this.reference)
      }else{
        this.$store.commit("unsetShiftLabeHovering", this.reference)
      }
    },
    setLoading(value) {
      this.isLoading = value;
    },
    getNameOfAVigilantByID(id) {
      let v = this.$store.getters.getVigilantByID(id);
      return v ? v.name.split(" ")[0] : this.reference;
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
