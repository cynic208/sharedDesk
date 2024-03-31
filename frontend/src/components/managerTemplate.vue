<template>
  <div class="grid">
    <div>
      <p style="font-weight: 800; margin: 96px 39px 16px; font-size: 20px">
        Auslastung
      </p>
      <div v-if="deskStats.statsByDepartment" class="desk_element_container">
        <div
          class="desk_element"
          v-for="deskStats in deskStats.statsByDepartment"
          :key="deskStats.statsByDepartment"
          style="background-color: #f1f1f1"
        >
          <div class="column1">
            <span
              style="font-weight: 800; line-height: 1; margin-bottom: 7px"
              >{{ deskStats ? deskStats.department : "" }}</span
            >
            <span
              style="
                font-size: 12px;
                font-weight: 400;
                line-height: 1;
                margin-bottom: 2px;
              "
            >
              Belegte Tische:
              <span
                style="font-size: 15px; font-weight: 800; margin-left: 6px"
                >{{ deskStats.occupiedDesks }}</span
              >
              / {{ deskStats.totalDesks }}</span
            >
          </div>
          <div
            class="percent_div"
            :style="{
              backgroundColor: backgroundColor(
                deskStats.occupiedDesks,
                deskStats.totalDesks
              ),
            }"
          >
            <span style="margin-bottom: 1px; padding-left: 5px"
              >{{
                Math.round(
                  (deskStats.occupiedDesks / deskStats.totalDesks) * 100,
                  2
                )
              }}<span style="font-size: 10px; margin-left: 2px">%</span></span
            >
          </div>
        </div>
        <div class="desk_element" style="margin-top: 8px">
          <div class="column1">
            <span style="font-weight: 800; line-height: 1; margin-bottom: 7px"
              >Gesamt</span
            >
            <span
              style="
                font-size: 12px;
                font-weight: 400;
                line-height: 1;
                margin-bottom: 2px;
              "
            >
              Belegte Tische:
              <span
                style="font-size: 15px; font-weight: 800; margin-left: 6px"
                >{{ deskStats.totalOccupiedDesks }}</span
              >
              / {{ deskStats.totalDesks }}</span
            >
          </div>
          <div
            class="percent_div"
            :style="{
              backgroundColor: backgroundColor(
                deskStats.totalOccupiedDesks,
                deskStats.totalDesks
              ),
            }"
          >
            <span style="margin-bottom: 1px; padding-left: 5px"
              >{{
                Math.round(
                  (deskStats.totalOccupiedDesks / deskStats.totalDesks) * 100,
                  2
                )
              }}<span style="font-size: 10px; margin-left: 2px">%</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <div>
      <p style="font-weight: 800; margin: 32px 39px 16px; font-size: 20px">
        Auswertung der Ausstattung
      </p>
      <div v-if="evaluationDetail" class="desk_element_container">
        <div
          class="desk_element"
          v-for="evaluation in evaluationDetail"
          :key="evaluation.department"
          style="background-color: #f1f1f1; flex-direction:column"
        >
          <div class="column1">
            <span
              style="font-weight: 800; line-height: 1; margin-bottom: 16px"
              >{{ evaluation ? evaluation.department : "" }}</span
            >
          </div>
          <div style="display: flex; flex-direction: column;">
            <div v-for="features in evaluation.features" :key="features.featureType" class="div_divider">
              <div v-if="features.featureType === 'HeightAdjustable'" style="display:grid; grid-row-gap: 4px">
                <div v-for="value in features.values" :key="value.featureValue" style="display: grid; grid-template-columns: 96px 64px 96px 1fr; grid-column-gap: 8px">
                  <div style="display:flex; align-items: center; flex-wrap: wrap">
                    <img src="@/assets/adjustable.svg" style="margin-right: 12px"/>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 0 ? '#faa95f' : '#d7d7d7'}"></div>
                  </div>
                  <span style="font-size: 12px">
                    Tische: <span style="font-weight: 600">{{value.deskCount}}</span>
                  </span>
                  <span style="font-size: 12px">
                    Mitarbeiter: <span style="font-weight: 600">{{value.employeeCount}}</span>
                  </span>
                  <span style="font-size: 12px; font-weight:800; text-align: right" :style="{color: value.deskCount - value.employeeCount<0 && value.featureValue.low > 0 ? '#f06560' : '#d7d7d7'}">
                    <span v-if="value.deskCount - value.employeeCount > 0">+</span>{{value.deskCount - value.employeeCount}}
                  </span>
                </div>
              </div>
              <div v-if="features.featureType === 'Monitors'" style="display:grid; grid-row-gap: 4px">
                <div v-for="value in features.values" :key="value.featureValue" style="display: grid; grid-template-columns: 96px 64px 96px 1fr; grid-column-gap: 8px">
                  <div style="display:flex; align-items: center; flex-wrap: wrap">
                    <img src="@/assets/monitor.png" style="height: 14px; width: 14px; margin-right: 12px"/>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 0 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 1 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 2 ? '#faa95f' : '#d7d7d7'}"></div>
                  </div>
                  <span style="font-size: 12px">
                    Tische: <span style="font-weight: 600">{{value.deskCount}}</span>
                  </span>
                  <span style="font-size: 12px">
                    Mitarbeiter: <span style="font-weight: 600">{{value.employeeCount}}</span>
                  </span>
                  <span style="font-size: 12px; font-weight:800; text-align: right" :style="{color: value.deskCount - value.employeeCount<0 && value.featureValue.low > 1 ? '#f06560' : '#d7d7d7'}">
                    <span v-if="value.deskCount - value.employeeCount > 0">+</span>{{value.deskCount - value.employeeCount}}
                  </span>
                </div>
              </div>
              <div v-if="features.featureType === 'Volume'" style="display:grid; grid-row-gap: 4px">
                <div v-for="value in features.values" :key="value.featureValue" style="display: grid; grid-template-columns: 96px 64px 96px 1fr; grid-column-gap: 8px">
                  <div style="display:flex; align-items: center; flex-wrap: wrap">
                    <img src="@/assets/volume.png" style="height: 16px; width: 16px; margin-right: 12px"/>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 0 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 1 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 2 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 3 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 4 ? '#faa95f' : '#d7d7d7'}"></div>
                  </div>
                  <span style="font-size: 12px">
                    Tische: <span style="font-weight: 600">{{value.deskCount}}</span>
                  </span>
                  <span style="font-size: 12px">
                    Mitarbeiter: <span style="font-weight: 600">{{value.employeeCount}}</span>
                  </span>
                  <span style="font-size: 12px; font-weight:800; text-align: right" :style="{color: value.deskCount - value.employeeCount<0 && value.featureValue.low < 5 ? '#f06560' : '#d7d7d7'}">
                    <span v-if="value.deskCount - value.employeeCount > 0">+</span>{{value.deskCount - value.employeeCount}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
                <div
          class="desk_element"
          style="background-color: #fff; flex-direction:column; margin-top: 8px"
        >
          <div class="column1">
            <span
              style="font-weight: 800; line-height: 1; margin-bottom: 16px"
              >Gesamt</span
            >
          </div>
          <div style="display: flex; flex-direction: column;">
            <div v-for="features in evaluationTotal" :key="features.featureType" class="div_divider">
              <div v-if="features.featureType === 'HeightAdjustable'" style="display:grid; grid-row-gap: 4px">
                <div v-for="value in features.values" :key="value.featureValue" style="display: grid; grid-template-columns: 96px 64px 96px 1fr; grid-column-gap: 8px">
                  <div style="display:flex; align-items: center; flex-wrap: wrap">
                    <img src="@/assets/adjustable.svg" style="margin-right: 12px"/>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 0 ? '#faa95f' : '#d7d7d7'}"></div>
                  </div>
                  <span style="font-size: 12px">
                    Tische: <span style="font-weight: 600">{{value.totalDesks}}</span>
                  </span>
                  <span style="font-size: 12px">
                    Mitarbeiter: <span style="font-weight: 600">{{value.totalEmployees}}</span>
                  </span>
                  <span style="font-size: 12px; font-weight:800; text-align: right" :style="{color: value.totalDesks - value.totalEmployees<0 && value.featureValue.low > 0 ? '#f06560' : '#d7d7d7'}">
                    <span v-if="value.totalDesks - value.totalEmployees > 0">+</span>{{value.totalDesks - value.totalEmployees}}
                  </span>
                </div>
              </div>
              <div v-if="features.featureType === 'Monitors'" style="display:grid; grid-row-gap: 4px">
                <div v-for="value in features.values" :key="value.featureValue" style="display: grid; grid-template-columns: 96px 64px 96px 1fr; grid-column-gap: 8px">
                  <div style="display:flex; align-items: center; flex-wrap: wrap">
                    <img src="@/assets/monitor.png" style="height: 14px; width: 14px; margin-right: 12px"/>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 0 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 1 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 2 ? '#faa95f' : '#d7d7d7'}"></div>
                  </div>
                  <span style="font-size: 12px">
                    Tische: <span style="font-weight: 600">{{value.totalDesks}}</span>
                  </span>
                  <span style="font-size: 12px">
                    Mitarbeiter: <span style="font-weight: 600">{{value.totalEmployees}}</span>
                  </span>
                  <span style="font-size: 12px; font-weight:800; text-align: right" :style="{color: value.totalDesks - value.totalEmployees<0 && value.featureValue.low > 1 ? '#f06560' : '#d7d7d7'}">
                    <span v-if="value.totalDesks - value.totalEmployees > 0">+</span>{{value.totalDesks - value.totalEmployees}}
                  </span>
                </div>
              </div>
              <div v-if="features.featureType === 'Volume'" style="display:grid; grid-row-gap: 4px">
                <div v-for="value in features.values" :key="value.featureValue" style="display: grid; grid-template-columns: 96px 64px 96px 1fr; grid-column-gap: 8px">
                  <div style="display:flex; align-items: center; flex-wrap: wrap">
                    <img src="@/assets/volume.png" style="height: 16px; width: 16px; margin-right: 12px"/>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 0 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 1 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 2 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 3 ? '#faa95f' : '#d7d7d7'}"></div>
                    <div class="circle" :style="{backgroundColor:value.featureValue.low > 4 ? '#faa95f' : '#d7d7d7'}"></div>
                  </div>
                  <span style="font-size: 12px">
                    Tische: <span style="font-weight: 600">{{value.totalDesks}}</span>
                  </span>
                  <span style="font-size: 12px">
                    Mitarbeiter: <span style="font-weight: 600">{{value.totalEmployees}}</span>
                  </span>
                  <span style="font-size: 12px; font-weight:800; text-align: right" :style="{color: value.totalDesks - value.totalEmployees<0 && value.featureValue.low < 5 ? '#f06560' : '#d7d7d7'}">
                    <span v-if="value.totalDesks - value.totalEmployees > 0">+</span>{{value.totalDesks - value.totalEmployees}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p style="font-weight: 800; margin: 32px 39px 16px; font-size: 20px">
        Mitarbeiter hinzufügen
      </p>
      <div v-if="deskStats.statsByDepartment" class="desk_element_container">
        <div
          class="desk_element"
          style="background-color: #fff"
        >
          <div class="column1">
            <div style="padding-top:4px">
              <span style="font-size: 12px">Abteilung:</span>
              <select v-model="selectedDepartment">
                <option disabled value="">Bitte wählen...</option>
                <option v-for="department in this.departments" :value="department" :key="department">{{ department }}</option>
              </select>
            </div>
          </div>
          <div class="column2">
            <button @click="createEmployee(this.selectedDepartment)" class="button">Anlegen</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p style="font-weight: 800; margin: 32px 39px 16px; font-size: 20px">
        Mitarbeiter entfernen
      </p>
      <div v-if="deskStats.statsByDepartment" class="desk_element_container">
        <div
          class="desk_element"
          style="background-color: #fff"
        >
          <div class="column1">
            <div style="padding-top:4px">
              <span style="font-size: 12px">Mitarbeiter ID: </span>
              <input value="1" type="number" ref="deleteId"/>
            </div>
          </div>
          <div class="column2">
            <button @click="deleteEmployee($refs.deleteId.value)" class="button">Löschen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';

export default {
  data() {
    return {
      deskStats: [],
      evaluationTotal: [],
      evaluationDetail: [],
      departments: [],
      selectedDepartment: ''
    };
  },

  methods: {

    backgroundColor(value1, value2) {
      let percentage = value1 / value2;
      if (percentage >= 0.9) {
        return "#f06560";
      } else if (percentage >= 0.7) {
        return "#faa95f";
      } else if (percentage >= 0.5) {
        return "#f0dc65";
      } else if (percentage >= 0.3) {
        return "#9ee87c";
      } else {
        return "#bdbbbb";
      }
    },

    async createEmployee(department) {
      try {
        const response = await axios.post(
          `http://localhost:3000/manager/employee/${department}`
        );
        alert(response.data.message  + " Mit ID:" + response.data.id);
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async deleteEmployee(employeeId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/manager/employee/${employeeId}`
        );
        alert(response.data);
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async fetchDepartments() {
      try {
        const response = await axios.get(
          `http://localhost:3000/manager/departments`
        );
        this.departments = response.data.departments;
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async fetchDeskStats() {
      try {
        const response = await axios.get(
          `http://localhost:3000/manager/desk-stats`
        );
        this.deskStats = response.data;
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async fetchEvaluation() {
      try {
        const response = await axios.get(
          `http://localhost:3000/manager/evaluation`
        );
        console.log(response.data.overall);
        this.evaluationTotal = response.data.overall;
        this.evaluationDetail = response.data.detailed;
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },
  },

  mounted() {
    this.fetchDeskStats();
    this.fetchEvaluation();
    this.fetchDepartments();
  },

  computed: {
    ...mapState(['triggerDeskFunction', 'triggerPrefFunction']),
  },

  watch: {
    '$store.state.triggerDeskFunctions': {
      immediate: false,
      handler() {
        this.fetchDesksStats();
      },
    },
    '$store.state.triggerPrefFunctions': {
      immediate: false,
      handler() {
        this.fetchEvaluation();
      },
    },
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-rows: 1fr auto auto;
  max-width: calc(390px - 0px);
  max-height: calc(720px - 0px);
  overflow-y: scroll;
  height: 100%;
}

.desk_element_container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0px 16px 16px;
  scrollbar-width: none;
}

.desk_element_container::-webkit-scrollbar {
  display: none;
}

.desk_element {
  display: flex;
  padding: 24px 24px 26px 24px;
  background-color: #fff;
  border-radius: 16px;
  justify-content: space-between;
  box-shadow: 0px 0px 32px #00000021;
}

.desk_element > .column1 {
  display: flex;
  flex-direction: column;
}

.desk_element > .column1 > .row {
  display: flex;
  flex-direction: row;
  height: 16px;
  gap: 12px;
}

.desk_element > .column2 {
  display: flex;
}

.button {
  font-family: "Montserrat", sans-serif;
  background-color: #333;
  color: #fff;
  border-radius: 10px;
  border: none;
  height: 36px;
  width: 102px;
  margin: 0px;
  padding-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  box-shadow: 0px 0px 16px #00000047;
}

.button:hover {
  transform: scale(1.02);
  box-shadow: 0px 0px 24px #00000047;
}

.button:active {
  transform: scale(1);
  box-shadow: 0px 0px 16px #00000047;
}

.button.sec {
  background-color: #fff;
  height: 40px;
  border: solid 0.5px #888;
  color: #666;
  box-shadow: 0px 0px 16px #00000014;
  font-weight: 500;
}

.button.sec:hover {
  box-shadow: 0px 0px 24px #00000021;
}

.button.sec:active {
  transform: scale(1);
  box-shadow: 0px 0px 16px #00000014;
}

.button.hl {
  background-color: #faa95f;
  box-shadow: 0px 0px 16px #9a60296b;
}

.button.hl:hover {
  box-shadow: 0px 0px 24px #9a60296b;
}

.button.hl:active {
  transform: scale(1);
  box-shadow: 0px 0px 16px #9a60296b;
}

.option_div_container {
  position: relative;
  padding: 0px 16px 0px;
}

.option_div_container:last-child {
  padding: 16px 16px;
}

.option_div {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  justify-content: space-between;
  box-shadow: 0px 0px 32px #00000021;
}

.range-slider {
  flex: 1;
  position: relative;
}

.sliderticks {
  display: flex;
  justify-content: space-between;
  padding: 0 1px;
}

.sliderticks span {
  display: flex;
  justify-content: center;
  width: 1px;
  height: 3px;
  background: #d1d1d1;
  margin-top: 1px;
}

.sliderticks span:first-child {
  margin-left: 10px;
}

.sliderticks span:last-child {
  margin-right: 4px;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 15px;
  margin: 0px;
  height: 2px;
  background: #efefef;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background-color: #fff;
  box-shadow: 0px 0px 8px #00000032;
  border-radius: 50%;
  margin-left: 3px;
  transition: 0.2s ease-in-out;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.25);
  box-shadow: 0px 0px 12px #00000032;
}

input[type="range"]::-moz-range-thumb {
  height: 21px;
  width: 21px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0px 0px 8px #00000032;
  margin-left: 3px;
  transition: 0.2s ease-in-out;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.25);
  box-shadow: 0px 0px 12px #00000032;
}

.range {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  margin: -3px auto 0;
  height: 13px;
  width: 80%;
  background: #fff;
  padding: 0px 0px;
}

.slider-value {
  position: absolute;
  font-size: 12px;
  bottom: 0px;
  left: 0px;
  transform: translateX(-25px);
  margin-left: 10px;
  opacity: 0;
  z-index: 0;
  transition: all 200ms ease-in-out;
  transition-delay: 0.3s;
}

input[type="range"]:hover ~ .slider-value {
  opacity: 1;
  transition-delay: 0s;
}

input[type="checkbox"] {
  position: relative;
  width: 44px;
  height: 22.5px;
  -webkit-appearance: none;
  margin: 0;
  appearance: none;
  background: #efefef;
  outline: none;
  border-radius: 2rem;
  cursor: pointer;
  box-shadow: inset 0px 0px 8px #0000000a;
}

input[type="checkbox"]::before {
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 100%;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 5px;
  transition: all 150ms cubic-bezier(0.52, 0.22, 0.62, 1.3), left 200ms ease-out;
  box-shadow: 0px 0px 8px #0000001d;
}

input[type="checkbox"]:hover::before {
  left: 7px;
}

input[type="checkbox"]:checked::before {
  transform: translateX(19px);
  background: #fff;
}

input[type="checkbox"]:checked {
  background: #faa95f;
}

input[type="checkbox"]:checked:hover::before {
  left: 3px;
}

.percent_div {
  display: flex;
  flex-wrap: wrap;
  height: 37px;
  width: 74px;
  max-width: 74px;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  border-radius: 8px;
  background-color: #bdbbbb;
  box-shadow: 0px 0px 12px #0000001c;
  justify-content: center;
  align-content: center;
}

.circle {
  height: 8px;
  width: 8px;
  background-color: #d7d7d7;
  border-radius: 100%;
  margin-right: 3px;
}

.div_divider{
  border-bottom: solid 1px #ccc;
  padding-top: 4px;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.div_divider:last-child{
  border-bottom: solid 0px #ccc;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.div_divider:first-child{
  border-top: solid 1px #ccc;
    padding-top: 8px;
}

input{
  font-family: 'Montserrat';
  color: #faa95f;
  border: none;
  text-align: center;
  width: 48px;
  font-weight: 600;
}

select{
  font-family: 'Montserrat';
  color: #faa95f;
  border: none;
  width: 120px;
  font-weight: 600;
  margin-left: 8px;
  border-bottom: solid 1px #ccc;
}

input:focus, select:focus, input:focus-visible, select:focus-visible {
  border: none;
  outline: none;
  border-bottom: solid 1px #ccc;
}
</style>
