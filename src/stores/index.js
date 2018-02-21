import Vue from 'vue'
import Vuex from 'vuex'

import gunAccounts from './gun-accounts'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appVersion: '0.1.0'
  },

  modules: {
    gunAccounts: {
      namespaced: true,
      ...gunAccounts
    }
  }
})
