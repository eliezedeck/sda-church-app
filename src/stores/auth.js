import Vue from 'vue'
import Vuex from 'vuex'
import FApp from './firebase'
import {vm} from '../main.js'


Vue.use(Vuex)

export const SAuth = new Vuex.Store({
  state: {
    user: null,
    memberProfile: null,
    redirectPath: ''
  },

  getters: {
    displayName(state) {
      let dn = 'Visitor'
      if (state.memberProfile && state.memberProfile.displayName)
        dn = state.memberProfile.displayName
      else if (state.user && state.user.phoneNumber)
        dn = `Member (${state.user.phoneNumber})`
      return dn
    }
  },

  mutations: {
    UPDATE_FIREBASE_USER(state, {user}) {
      if (user) {
        state.user = {
          uid: user.uid,
          displayName: user.phoneNumber,
          phoneNumber: user.phoneNumber
        }

        // Redirect ...
        if (state.redirectPath) {
          const path = state.redirectPath
          state.redirectPath = '' // clear the redirectPath right before redirecting
          vm.$router.replace(path)
        }
      } else {
        state.user = user
      }
    },

    UPDATE_MEMBER_PROFILE(state, {member}) {
      state.memberProfile = member
    },

    ASK_TO_LOGIN(state, {redirectPath}) {
      if (state.user) {
        // Already logged-in
        state.redirectPath = ''
        return
      }

      state.redirectPath = redirectPath
    }
  }
})


let memberProfileRefURI = null

// Watch for changes on the Firebase Auth
FApp.auth().onAuthStateChanged((user) => {
  SAuth.commit('UPDATE_FIREBASE_USER', {user})

  if (memberProfileRefURI)
    memberProfileRefURI.off()
  memberProfileRefURI = FApp.database().ref(`/members/${user.uid}`)

  // Watch changes on the /members/$uid
  memberProfileRefURI.on('value', (snapshot) => {
    if (snapshot.exists()) {
      SAuth.commit('UPDATE_MEMBER_PROFILE', {member: snapshot.val()})
    } else {
      SAuth.commit('UPDATE_MEMBER_PROFILE', {member: null})
    }
  })
})
