import Vue from 'vue'
import Vuex from 'vuex'
import FApp from './firebase'


Vue.use(Vuex)

export const SAuth = new Vuex.Store({
  state: {
    user: null,
    memberProfile: null
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
      } else {
        state.user = user
      }
    },

    UPDATE_MEMBER_PROFILE(state, {member}) {
      state.memberProfile = member
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
      console.log(snapshot.val())
    } else {
      SAuth.commit('UPDATE_MEMBER_PROFILE', {member: null})
    }
  })
})
