<template>
    <div class="grid">
      <div v-if="hasDesk && ownDesk" style="padding: 16px">
        <p style="font-weight: 800; margin: 96px 24px 16px; font-size: 20px">Ihr gebuchter Tisch:</p>
        <div class="desk_element">
          <div class="column1">
            <span style="font-weight: 800; line-height: 1; margin-bottom: 7px"
              >Schreibtisch
              <span style="font-weight: 400">#{{ ownDesk.desk.id.low }}</span></span
            >
            <div class="row">
              <div style="display: flex; flex-direction: row; gap: 6px">
                <img
                  src="@/assets/volume.png"
                  style="height: 16px; width: 16px"
                />
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    align-content: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[1].value.low > 0 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[1].value.low > 1 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[1].value.low > 2 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[1].value.low > 3 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[1].value.low > 4 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                </div>
              </div>
              <div style="display: flex; flex-direction: row; gap: 6px">
                <img
                  src="@/assets/monitor.png"
                  style="height: 14px; width: 14px; margin-top: 1px"
                />
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    align-content: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[0].value.low > 0 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[0].value.low > 1 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[0].value.low > 2 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                </div>
              </div>
              <div style="display: flex; flex-direction: row; gap: 6px">
                <img src="@/assets/adjustable.svg" />
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    align-content: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        ownDesk.features[2].value.low === 1 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="column2">
            <button @click="removeDesk()" class="button hl">Freigeben</button>
          </div>
        </div>
      </div>
      <div v-else-if="desks" class="desk_element_container">
        <div class="desk_element" v-for="desk in desks" :key="desk.id">
          <div class="column1">
            <span style="font-weight: 800; line-height: 1; margin-bottom: 7px"
              >Schreibtisch
              <span style="font-weight: 400">#{{ desk.desk.id.low }}</span><span style="font-size: 10px; color: #ccc">  - {{ desk.department ? desk.department.name : '' }} </span></span
            >
            <div class="row">
              <div style="display: flex; flex-direction: row; gap: 6px">
                <img
                  src="@/assets/volume.png"
                  style="height: 16px; width: 16px"
                />
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    align-content: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[1].value.low > 0 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[1].value.low > 1 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[1].value.low > 2 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[1].value.low > 3 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[1].value.low > 4 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                </div>
              </div>
              <div style="display: flex; flex-direction: row; gap: 6px">
                <img
                  src="@/assets/monitor.png"
                  style="height: 14px; width: 14px; margin-top: 1px"
                />
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    align-content: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[0].value.low > 0 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[0].value.low > 1 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[0].value.low > 2 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                </div>
              </div>
              <div style="display: flex; flex-direction: row; gap: 6px">
                <img src="@/assets/adjustable.svg" />
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    align-content: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        desk.features[2].value.low === 1 ? '#faa95f' : '#efefef',
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="column2">
            <button @click="assignDesk(desk.desk.id.low)" class="button">Buchen</button>
          </div>
        </div>
        <div v-if="desks.length === 0" class="desk_element" style="background-color: transparent"> 
          <span><b>Es wurde leider kein passender Schreibtisch gefunden.</b> <br> Bitte passen Sie Ihre Präferenzen an.</span>
        </div>
      </div>
      <div class="option_div_container">
        <div class="option_div">
          <span style="font-weight: 800; line-height: 1; margin-bottom: 16px"
            >Präferenzen</span
          >
          <div
            style="
              display: flex;
              flex-direction: row;
              gap: 6px;
              margin-bottom: 16px;
            "
          >
            <span style="font-size: 12px; line-height: 1; width: 96px"
              >Lautstärke</span
            >
            <div class="range">
              <div class="range-slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value="1"
                  id="range"
                  step="1"
                  class="slider"
                  v-model="volume"
                  :style="sliderStyle"
                />
                <span id="sliderValue" class="slider-value">{{ volume }}</span>
                <div class="sliderticks">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              gap: 6px;
              margin-bottom: 24px;
            "
          >
            <span style="font-size: 12px; line-height: 1; width: 96px"
              >Monitore</span
            >
            <div class="range">
              <div class="range-slider">
                <input
                  type="range"
                  min="1"
                  max="3"
                  value="1"
                  id="range"
                  step="1"
                  class="slider"
                  v-model="monitors"
                  :style="sliderStyle2"
                />
                <span id="sliderValue" class="slider-value">{{ monitors }}</span>

                <div class="sliderticks">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              gap: 6px;
              justify-content: space-between;
              height: 22px;
            "
          >
            <span style="font-size: 12px; line-height: 1"
              >Höhenverstellbarer Schreibtisch</span
            >
            <div style="margin-top: -4px">
              <input type="checkbox" v-model="adjustable" />
            </div>
          </div>
          <button @click="updatePreferences()" class="button sec" style="width: 100%; margin: 16px 0px 2px">
            Änderungen speichern
          </button>
        </div>
      </div>
      <div class="option_div_container">
        <div class="option_div">
          <span style="font-weight: 800; line-height: 1; margin-bottom: 16px"
            >Filter</span
          >
          <div
            style="
              display: flex;
              flex-direction: row;
              gap: 6px;
              justify-content: space-between;
              height: 22px;
              margin-bottom: -4px;
            "
          >
            <span style="font-size: 12px; line-height: 1"
              >Nur Tische in meiner Abteilung anzeigen</span
            >
            <div style="margin-top: -4px">
              <input v-model="onlyMyDep" type="checkbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      socket: null,
      volume: 1,
      monitors: 1,
      adjustable: false,
      desks: [],
      hasDesk: false,
      ownDesk: [],
      onlyMyDep: false,
    };
  },

  methods: {
    ...mapActions(['updateemployeeData']),

    async assignDesk(deskId) {
      try {
        await axios.post(
          `http://localhost:3000/employee/${this.employeeId}/assign-desk?deskId=${deskId}`
        );
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async removeDesk() {
      try {
        await axios.put(
          `http://localhost:3000/employee/${this.employeeId}/remove-desk`
        );
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async checkhasDesk() {
      try {
        const response = await axios.get(
          `http://localhost:3000/employee/${this.employeeId}/has-desk`
        );
        this.hasDesk = response.data.hasDesk;
        this.ownDesk = response.data
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async fetchEmployeeData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/employee/${this.employeeId}`
        );
          this.updateemployeeData(response.data).then(() => {
            this.volume = parseInt(this.findFeatureValue(response.data.features, "Volume"));
            this.monitors = parseInt(this.findFeatureValue(response.data.features, "Monitors"));
            this.adjustable = Boolean(this.findFeatureValue(response.data.features, "HeightAdjustable"));
            this.fetchDesks();
          });
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async fetchDesks() {
      try {
        const response = await axios.get(
          `http://localhost:3000/desks?heightAdjustable=${
            this.adjustable ? 1 : 0
          }&monitors=${this.monitors}&volume=${this.volume}&department=${this.onlyMyDep ? this.employeeData.department.name : ''}`
        );
        this.desks = response.data;
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    async updatePreferences() {
      try {
        const response = await axios.put(
          `http://localhost:3000/employee/${this.employeeId}?heightAdjustable=${
            this.adjustable ? 1 : 0
          }&monitors=${this.monitors}&volume=${this.volume}`
        );
        console.log(`http://localhost:3000/employee/${this.employeeId}?heightAdjustable=${
            this.adjustable ? 1 : 0
          }&monitors=${this.monitors}&volume=${this.volume}`);
        alert(response.data);
        this.fetchEmployeeData();
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },

    findFeatureValue(features, featureType) {
        const feature = features.find(f => f.type === featureType);
        return feature ? feature.value.low : null; 
    },

  },

  computed: {
    ...mapState(['employeeId']),
    ...mapState(['employeeData']),
    ...mapState(['triggerDeskFunction']),

    sliderStyle() {
      const min = 1;
      const max = 5;
      const progress = ((this.volume - min) / (max - min)) * 100;
      return {
        background: `linear-gradient(to right, #FAA95F ${progress}%, #efefef ${progress}%)`,
      };
    },

    sliderStyle2() {
      const min = 1;
      const max = 3;
      const progress = ((this.monitors - min) / (max - min)) * 100;
      return {
        background: `linear-gradient(to right, #FAA95F ${progress}%, #efefef ${progress}%)`,
      };
    },
  },

  mounted() {
    this.fetchEmployeeData();
    this.checkhasDesk();
  },

  watch: {
    adjustable: {
      immediate: false,
      handler() {
        this.fetchDesks();
      },
    },
    volume: {
      immediate: false,
      handler() {
        this.fetchDesks();
      },
    },
    monitors: {
      immediate: false,
      handler() {
        this.fetchDesks();
      },
    },
    onlyMyDep: {
      immediate: false,
      handler() {
        this.fetchDesks();
      },
    },
    '$store.state.employeeId': {
      immediate: false,
      handler() {
        this.fetchEmployeeData();
        this.checkhasDesk();
      },
    },
    '$store.state.triggerDeskFunctions': {
      immediate: false,
      handler() {
        this.fetchDesks();
        this.checkhasDesk();
      },
    },
  },
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

.desk_element_container{
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: scroll;
  padding: 80px 16px 16px;
  scrollbar-width: none;
  margin-bottom: -200px;
  padding-bottom: 216px;
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

.circle {
  height: 8px;
  width: 8px;
  background-color: #efefef;
  border-radius: 100%;
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

.option_div_container{
  position: relative;
  padding: 0px 16px 0px;
}

.option_div_container:last-child{
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

</style>
