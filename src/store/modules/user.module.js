const state = {
  userId: "",
  emailId: "",
  userRole: "user",
  name:"",
}

const mutations = {
  SET_USERID(state, value) {
    state.userId = value
  },
  SET_EMAILID(state, value) {
    state.emailId = value
  },
  SET_USERROLE(state, value) {
    state.userRole = value
  },
  SET_NAME(state, value){
    state.name = value
  }
}

const actions = {
  updateUserId({ commit }, payload) {
    commit('SET_USERID', payload)
  },
  updateEmailId({ commit }, payload) {
    commit('SET_EMAILID', payload)
  },
  updateUserRole({ commit }, payload) {
    commit('SET_USERROLE', payload)
  },
  updateUserName({commit},payload){
    commit('SET_NAME', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}