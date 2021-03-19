<template>
  <b-row>
    <b-col cols="12">
      <b-button :size="'sm'" v-b-modal="`modal-${day}-${reference}-${place.name}`"
        ><i
          v-bind:class="{
            'text-danger': isPending,
            'fa-sun': !isNigth,
          }"
          class="fas fa-moon text-success dayIcon"
        ></i
      ></b-button>
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
      <small
        class="text-success referenceIcon"
        v-bind:class="{ 'text-danger': isPending }"
        >{{ nameSelected }}</small
      >
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "ModalVigilant",
  props: ["isPending", "reference", "day", "isNigth", "place", "shift"],
  data() {
    return {
      selected: null,
      nameSelected: this.reference,
    };
  },
  computed: {
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
    refreshNameSelected() {
      if (this.selected != null) {
        this.nameSelected = this.$store.getters
          .getVigilantByID(this.selected)["name"].split(" ")[0];
      } else {
        this.nameSelected = this.reference;
      }
      return this.nameSelected ? this.nameSelected : this.reference;
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
      this.refreshNameSelected();
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
      console.log("Select name: " + this.nameSelected);
      this.refreshNameSelected();
    }
  },
};
</script>

<style lang='scss' scooped>
.dayIcon {
  font-size: 20px;
}
.referenceIcon {
  font-size: 11px;
}
.modal-backdrop {
  opacity: 0.7;
}
</style>
