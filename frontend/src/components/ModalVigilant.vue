<template>
  <b-row>
    <b-col cols="12" v-if="!past">
      <i 
      class='far fa-thumbs-down btnCalendar' 
      :class="[{'fa-thumbs-up': !isPending},{'text-success': !isPending}]"
      v-b-modal="`modal-${day}-${reference}-${place.name}`"      
      v-b-tooltip.hover.bottom="getTooltipText"
        ></i>
      <b-modal
        :id="`modal-${day}-${reference}-${place.name}`"
        :title="`Schedule a vigilant to ${this.reference} - ${this.place.name}`"
        :ok-variant="'light'"
        :hide-header-close="true"
        :header-bg-variant="'secondary'"
        :footer-bg-variant="'secondary'"
        :body-bg-variant="'ligth'"
        :header-text-variant="'light'"
        @ok="handleClick"
      >
        <b-form-select
          v-model="selected"
          :options="options"
          class="w-100"
        ></b-form-select>
      </b-modal>
    </b-col>
    <b-col cols="12">
      <div
      v-b-hover="hoverHandle"
      class="text-success referenceIcon"
      v-bind:class="{ 'text-danger': isPending }"
      >
        {{ referenceNumber }}
      </div
      >
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "ModalVigilant",
  props: ["isPending", "reference", "day", "place", "shift", 'past'],
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    referenceNumber(){
      return this.$store.getters.referenceNumber(this.reference)
    },
    vigilants() {
      return this.$store.state.vigilants;
    },
    options() {
      let opt = [];
      opt.push({ value: null, text: "No vigilant" });
      this.vigilants.map((each) => {
        opt.push({
          value: each._id,
          text: each.name,
        });
      });
      return opt;
    },
  },
  methods: {
    hoverHandle(isHovered){
      if(isHovered){
        this.$store.commit("setShiftLabelHovering", this.reference)
      }else{
        this.$store.commit("unsetShiftLabelHovering", this.reference)
      }
    },
    getNameOfAVigilantByID(id) {
      let v = this.$store.getters.getVigilantByID(id);
      return v ? v.name.split(" ")[0] : this.reference;
    },
    getTooltipText() {
      return this.isPending
        ? `Click to schedule a vigilant to ${this.reference.toLowerCase()}`
        : `${this.getNameOfAVigilantByID(
            this.shift.vigilantID
          )} is scheduled in ${this.reference.toLowerCase()}`;
    },
    async handleClick() {
      let payload = {
        _id: this.$store.getters.getShiftByDayAndRef({
          day: this.day,
          ref: this.reference,
          placeID: this.place._id,
        })["_id"],
        vigilantID: this.selected,
      };
      this.$emit("setLoading", true);
      await this.$store.dispatch("scheduleAVigilant", payload);
      this.$emit("setLoading", false);
    },
  },
  mounted() {
    if (!this.isPendingComputed) {
      let shift = this.$store.getters.getShiftByDayAndRef({
        day: this.day,
        ref: this.reference,
        placeID: this.place._id,
      });
      this.selected = shift.vigilantID;
    }
  },
};
</script>

<style lang='scss' scooped>
.dayIcon {
  font-size: 20px;
}
.referenceIcon {
  font-size: 10px;
  cursor: pointer;

}
.modal-backdrop {
  opacity: 0.7;
}
</style>
