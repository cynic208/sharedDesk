import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'

const eventBus = createStore({
    state: {
        employeeId: 1,
        employeeData: [],
        triggerDeskFunctions: false,
        triggerPrefunctions: false,
      },
      mutations: {
        setemployeeId(state, id) {
          state.employeeId = id;
        },

        setemployeeData(state, data) {
          state.employeeData = data;
        },

        TOGGLE_DESK_TRIGGER(state) {
            state.triggerDeskFunctions = !state.triggerDeskFunctions;
        },

        TOGGLE_PREF_TRIGGER(state) {
            state.triggerPrefFunctions = !state.triggerPrefFunctions;
        },
      },
      actions: {
        updateemployeeId({ commit }, id) {
          commit('setemployeeId', id);
        },

        updateemployeeData({ commit }, data) {
          commit('setemployeeData', data);
        },

        triggerDeskFunction({ commit }) {
            commit('TOGGLE_DESK_TRIGGER');
        },

        triggerPrefFunction({ commit }) {
            commit('TOGGLE_PREF_TRIGGER');
        }
      },
      getters: {
        employeeId: state => state.sharedId,
        employeeData: state => state.employeeData
      }
})

createApp(App).use(eventBus).use(router).mount('#app')
