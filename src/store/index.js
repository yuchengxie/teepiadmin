import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


var eventHub = new Vue()

export default new Vuex.Store({
  state: {
    // name: "teeOnlineState"
    teestate: '',
    clickstate: '',
    // dev_pubkey33: '',
  },
  mutations: {
    setTeeState(state, value) {
      if (state.teestate.state != value.state) {
        state.teestate = value;
        this.$emit('stateChange')
      }
    },
    setClickState(state, value) {
      // console.log('setClickState:', value);
      state.clickstate = value;
    },
    // setDevPubkey33(state, value) {
    //   state.dev_pubkey33 = value;
    // },
  },
  actions: {
  },
  modules: {
  }
})
