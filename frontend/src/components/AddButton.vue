<template>
  <b-overlay
    :show="isLoading"
    :variant="'dark'"
    :bg-color="'transparent'"
    :spinner-variant="'dark'"
    :blur="'5px'"
    :opacity="'0.5'"
    class="h-100"
  >
    <b-row>
      <b-col class='text-right'>
        <b-button
          v-b-modal="`modalAdd-${type}`"
          :variant="'primary'"
        >
          <i class="fas fa-plus"></i>
        </b-button>
        <b-modal
          :id="`modalAdd-${type}`"
          :title="`Add a ${type}`"
          :ok-disabled="!isFormValid"
          :ok-variant="'light'"
          :hide-header-close="true"
          :header-bg-variant="'secondary'"
          :footer-bg-variant="'secondary'"
          :body-bg-variant="'ligth'"
          :header-text-variant="'light'"
          @ok="handleClick"
        >
          <template #modal-backdrop>
            <div class="h-100 bg-dark modalOpacity"></div>
          </template>
          <label for="inputName">Name</label>
          <b-form-input
            id="inputName"
            v-model="name"
            :placeholder="`Create a new ${type}`"
          ></b-form-input>

          <label v-if="type === 'vigilant'" for="inputContact">Contact</label>
          <label v-else for="inputAddress">Address</label>

          <b-form-input
            id="inputAddress"
            v-model="address"
            placeholder="The new place address"
            v-if="type === 'place'"
          ></b-form-input>
          <b-form-input
            id="inputContact"
            v-model="contact"
            placeholder="The new vigilant contact"
            v-else
          ></b-form-input>

          <label v-if="type === 'place'" for="selectShifts"
            >Select the shifts</label
          >
          <b-row v-if="type === 'place'" id="selectShifts">
            <b-col cols="3" class="text-center">
              <i
                class="fas fa-sun text-secondary"
                :class="{ 'text-warning': morningSelected }"
                @click="morningSelected = !morningSelected"
                ><small
                  v-if="morningSelected"
                  class="fas fa-check text-success"
                ></small
              ></i>
              <br />
              <small>Morning</small>
            </b-col>
            <b-col class="text-center" cols="3">
              <i
                class="fas fa-sun text-secondary"
                :class="{ 'text-warning': afternoonSelected }"
                @click="afternoonSelected = !afternoonSelected"
                ><small
                  v-if="afternoonSelected"
                  class="fas fa-check text-success"
                ></small
              ></i>
              <br />
              <small>Afternoon</small>
            </b-col>
            <b-col class="text-center" cols="3">
              <i
                class="fas fa-moon text-secondary"
                :class="{ 'text-info': eveningSelected }"
                @click="eveningSelected = !eveningSelected"
                ><small
                  v-if="eveningSelected"
                  class="fas fa-check text-success"
                ></small
              ></i>
              <br />
              <small>Evening</small>
            </b-col>
            <b-col class="text-center" cols="3">
              <i
                class="fas fa-moon text-secondary"
                :class="{ 'text-info': dawnSelected }"
                @click="dawnSelected = !dawnSelected"
                ><small
                  v-if="dawnSelected"
                  class="fas fa-check text-success"
                ></small
              ></i>
              <br />
              <small>Dawn</small>
            </b-col>
          </b-row>
        </b-modal>
      </b-col>
    </b-row>
  </b-overlay>
</template>

<script>
export default {
  name: "AddButton",
  props: ["type"],
  data() {
    return {
      isLoading: false,
      name: "",
      address: "",
      contact: "",
      morningSelected: false,
      afternoonSelected: false,
      eveningSelected: false,
      dawnSelected: false,
    };
  },
  computed: {
    isShiftsValid() {
      return (
        this.morningSelected ||
        this.afternoonSelected ||
        this.eveningSelected ||
        this.dawnSelected
      );
    },
    references() {
      let refs = [];
      if (this.morningSelected) {
        refs.push("Morning");
      }
      if (this.afternoonSelected) {
        refs.push("Afternoon");
      }
      if (this.eveningSelected) {
        refs.push("Evening");
      }
      if (this.dawnSelected) {
        refs.push("Dawn");
      }
      return refs;
    },
    isFormValid() {
      if (this.type === "vigilant") {
        return this.name !== "" && this.contact !== "";
      }
      return this.name !== "" && this.address !== "" && this.isShiftsValid;
    },
    payload() {
      let payload = {};
      if (this.isFormValid) {
        payload.name = this.name;
        if (this.type === "vigilant") {
          payload.contact = this.contact;
        } else {
          payload.address = this.address;
          payload.references = this.references;
        }
      }
      return payload;
    },
  },
  methods: {
    async handleClick() {
      this.isLoading = true;
      if (this.isFormValid) {
        let payload = this.payload;
        this.clearForm();
        if (this.type === "vigilant") {
          await this.$store.dispatch("addVigilant", payload);
        } else {
          await this.$store.dispatch("addPlace", payload);
        }
      }
      this.isLoading = false;
    },
    clearForm() {
      this.name = "";
      this.address = "";
      this.contact = "";
      this.morningSelected = false;
      this.afternoonSelected = false;
      this.eveningSelected = false;
      this.dawnSelected = false;
    },
  },
};
</script>

<style lang="css">
.btnWrapper {
  padding: 5px;
}
i {
  margin-top: 10px;
  font-size: 30px;
}
.fa-check {
  font-size: 10px;
}
.modal-backdrop {
  opacity: 0.7;
}
</style>
