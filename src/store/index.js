import Vuex from 'vuex'

export default new Vuex.Store({
  mutations: {
    // SET_LOADING (state, boolean) {
    //   boolean ? ++state.requestLoading : --state.requestLoading
    // },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    }
  },
  actions: {},
  getters: {}
})
