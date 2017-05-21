import Vue from 'vue'
import Vuex from 'vuex'
import FApp from './firebase'


Vue.use(Vuex)

export const SAuth = new Vuex.Store({
  state: {
    user: null
  },

  mutations: {
    UPDATE_FIREBASE_USER(state, {user}) {
      if (user) {
        state.user = {
          displayName: user.displayName || user.phoneNumber,
          phoneNumber: user.phoneNumber || ''
        }
      } else {
        state.user = user
      }
    }
  }
})


// Watch for changes on the Firebase Auth
FApp.auth().onAuthStateChanged((user) => {
  SAuth.commit('UPDATE_FIREBASE_USER', {user})
})
