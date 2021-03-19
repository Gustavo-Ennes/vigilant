<template>
  <b-overlay
    :show="isLoading"
    :variant="'dark'"
    :bg-color="'transparent'"
    :spinner-variant="isReallyPending ? 'danger' : 'success'"
    :blur="'5px'"
    :opacity="'0.9'"
  >
    <b-row>
      <b-col
        cols="12"
        v-if="isNigth(reference)"
        class="text-center"
        v-b-tooltip.hover.bottom="getTooltipText"
      >
        <ModalVigilant
          :isPending="isReallyPending"
          :reference="reference"
          :day="day"
          :isNigth="true"
          :place="place"
          :shift="shift"
          @setLoading="setLoading"
        />
      </b-col>
      <b-col
        cols="12"
        v-if="isDay(reference)"
        class="text-center"
        v-b-tooltip.hover.top="getTooltipText"
      >
        <ModalVigilant
          :isPending="isReallyPending"
          :reference="reference"
          :day="day"
          :isNigth="false"
          :place="place"
          :shift="shift"
          @setLoading="setLoading"
        />
      </b-col>
    </b-row>
  </b-overlay>
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
</style>
