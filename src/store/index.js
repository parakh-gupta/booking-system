import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user.module"

Vue.use(Vuex)

export default new Vuex.Store({
//   state: {
//     counter: 0
//   },
//   mutations: {
//     SET_COUNTER(state, value) {
//       state.counter = value
//     }
//   },
//   actions: {
//     updateCounter({ commit }, payload) {
//       commit('SET_COUNTER', payload)
//     }
//   },
  modules: {
    user
  }
})