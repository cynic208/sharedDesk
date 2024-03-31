<template>
  <div class="header_container">
    <div class="header_bg" />
    <div class="header">
      <div class="user_img_div">
        <img class="user_img" src="@/assets/user.png" />
      </div>
      <span style="margin-top: 1px"
        ><span style="font-weight: 800">Mitarbeiter</span> #{{ this.employeeId }}</span
      >
      <span
        style="font-size: 10px; color: #ccc; font-weight: 800; margin-top: 2px"
      >
        - {{ employeeData.department ? employeeData.department.name : "" }}
      </span>
      <img
        @click="modalVisible = !modalVisible"
        class="set_img"
        src="@/assets/control.png"
      />
    </div>
  </div>
  <div v-show="modalVisible" class="modal_container">
      <div class="modal" style="padding-bottom: 23px">
          <span style="font-weight: 800; line-height: 1; margin-bottom: 6px">Ansicht wechseln</span>
        <div style="display: flex; gap: 24px; color: #faa95f; font-weight: 600">
          <router-link to="/" @click="modalVisible = !modalVisible"><span class="view_span">Mitarbeiteransicht</span></router-link>
          <router-link to="/manager" @click="modalVisible = !modalVisible"><span class="view_span">Manageransicht</span></router-link>
        </div>
      </div>
      <div class="modal" style="padding-bottom: 23px">
          <span style="font-weight: 800; line-height: 1; margin-bottom: 6px">Mitarbeiter wechseln</span>
        <div>
          <span style="font-size: 12px">Aktuelle Mitarbeiter ID: </span>
          <input v-model="employeeId" @change="updateemployeeId($event.target.value)" type="number" min="1"/>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      modalVisible: false,
    };
  },

  computed: {
    ...mapState(['employeeId']),
    ...mapState(['employeeData'])
  },

  mounted() {
    this.fetchEmployeeData();
  },

  methods: {
    ...mapActions(['updateemployeeData']),
    ...mapActions(['updateemployeeId']),

    updateId(newId) {
      this.updateSharedId(newId);
    },

    async fetchEmployeeData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/employee/${this.employeeId}`
        );
          this.updateemployeeData(response.data);
      } catch (error) {
        alert(error);
        console.error("Fehler beim Laden der Mitarbeiterdaten:", error);
      }
    },
  },

  watch: {
    '$store.state.employeeId': {
      immediate: false,
      handler() {
        this.fetchEmployeeData();
      },
    }
  },
};
</script>

<style scoped>
.header_container {
  position: sticky;
  height: 0px;
  z-index: 999;
}

.header{
  position: relative;
  z-index: 2;
  height: 48px;
  width: webkit-fill-available;
  margin: -64px 16px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 0px 32px #0000003f;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  padding: 0px 24px 1px 21px;
  gap: 12px;
}

.header_bg {
  position: sticky;
  height: 80px;
  background: linear-gradient(180deg, rgba(239,239,239,1) 0%, rgba(239,239,239,1) 30%, rgba(239,239,239,0) 100%);
}


.user_img_div{
  height: 28px;
  width: 28px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  background-color: #faa95f;
    border-radius: 100%;
    box-shadow: inset 0px 0px 4px #8f430d4a;
}

.user_img{
  height: 18px;
  width: 18px;
  border-radius: 100%;
  filter: invert();
}

.set_img {
  height: 22px;
    width: 22px;
    position: absolute;
    right: 25px;
    top: 12px;
    opacity: 0.3;
    transition: all 250ms ease;
    cursor: pointer;
}

.set_img:hover{
  opacity: 0.8;
}

.modal_container{
  backdrop-filter: blur(5px);
  background-color: #efefef5b;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  gap: 16px;

  position: absolute;
  height: 100vh;
  width: 100vw;
  max-width: calc(390px - 0px);
  max-height: calc(720px - 0px);
  border-radius: 20px;

  overflow-y: scroll;
  z-index: 998;
}

.modal{
  width: 100%;
  margin: 0px 16px;
    display: flex;
    flex-direction: column;
  padding: 24px 24px 26px 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 0px 32px #0000003d;
}

input{
  font-family: 'Montserrat';
  color: #faa95f;
  border: none;
  text-align: center;
  width: 48px;
  font-weight: 600;
}

a{
  text-decoration: none;
  transition: all 200ms ease-in-out;
}

a:hover{
  transform: scale(1.05);
}

.view_span {
  font-size: 12px;
  font-weight: 700;
  color: #faa95f;
  transition: all 200ms ease-in-out;
  cursor: pointer;
}

.view_span:hover {
  transform: scale(1.05);
  text-decoration: underline;
}
</style>
