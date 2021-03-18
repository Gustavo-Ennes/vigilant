<template>
  <b-overlay
    :show="isLoading"
    :variant="'dark'"
    :bg-color="'transparent'"
    :spinner-variant="isPending ? 'danger' : 'success'"
    :blur="'5px'"
    :opacity="'0.9'"
  >
    <b-row>
      <b-col
        cols="12"
        v-if="isNigth(reference)"
        class="text-center"
        v-b-tooltip.hover.bottom="getTooltipText()"
      >
        <ModalVigilant
          :isPending="isPending"
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
        v-b-tooltip.hover.top="getTooltipText()"
      >
        <ModalVigilant
          :isPending="isPending"
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
  methods: {
    setLoading(value) {
      this.isLoading = value;
    },
    getNameOfAVigilantByID(id) {
      let v = this.$store.getters.getVigilantByID(id);
      return v.name.split(" ")[0];
    },
    getTooltipText() {
      return this.isPending
        ? `Click to schedule a vigilant to ${this.reference.toLowerCase()}`
        : `${this.getNameOfAVigilantByID(
            this.shift.vigilantID
          )} is scheduled in ${this.reference.toLowerCase()}`;
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
