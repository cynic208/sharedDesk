<template>
  <div class="container">
    <mainHeader/>
    <router-view v-slot="{ Component }">
          <component :is="Component"></component>
    </router-view>
  </div>
</template>

<script>
import io from 'socket.io-client';
import mainHeader from './components/mainHeader.vue';
import { mapActions } from 'vuex';
export default {
  name: 'App',
  components: {
    mainHeader
  },
  data() {
    return {
      socket: null,
    };
  },

  methods: {
    ...mapActions(['triggerDeskFunction', 'triggerPrefFunction']),
  },

  mounted() {
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Verbunden mit WebSocket-Server");
    });

    this.socket.on("disconnect", () => {
      console.log("Vom WebSocket-Server getrennt");
    });

    this.socket.on("dataUpdated", () => {
        console.log("Daten wurden aktualisiert");
        this.triggerDeskFunction();
    });

    this.socket.on("prefUpdated", () => {
        console.log("Daten wurden aktualisiert");
        this.triggerPrefFunction();
    });
  },


  beforeUnmount() {
    if (this.socket) {
      this.socket.close(); 
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: transparent;
  font-size: 15px;
  line-height: 24px;
  color: #333;
}

body {
  background-color: #242424;
}


.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  max-width: calc(390px - 0px);
  max-height: calc(720px - 0px);
  margin: calc((100vh - 720px) / 2) auto;
  background-color: #efefef;
  border-radius: 24px;
  box-shadow: 0px 0px 96px #000000;
  overflow-y: scroll;
}
</style>
