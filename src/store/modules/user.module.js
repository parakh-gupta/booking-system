const state = {
  userId: "",
  emailId: "",
  userRole: "user"
}

const mutations = {
  SET_USERID(state, value) {
    state.userId = value
    //console.log(state.userId)
  },
  SET_EMAILID(state, value) {
    state.emailId = value
    //console.log(state.emailId)
  },
  SET_USERROLE(state, value) {
    state.userRole = value
    //console.log(state.userRole)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}