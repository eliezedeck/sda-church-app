import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'

import {Roles} from 'meteor/alanning:roles'


export default {
  state: {
    initialized: false,
    user: null,
    isZedeck: false,
    isAdmin: false,
    isChurchClerk: false,
    isMember: false
  },

  mutations: {
    updateUser(state, {user}) {
      if (user !== undefined) {
        state.initialized = true
        if (user !== null) {
          // Logged-in
          state.user = user
          state.isZedeck = Roles.userIsInRole(user._id, ['zedeck'])
          state.isAdmin = Roles.userIsInRole(user._id, ['admin'])
          state.isChurchClerk = Roles.userIsInRole(user._id, ['church-clerk'])
          state.isMember = Roles.userIsInRole(user._id, ['member'])
        }
        else {
          state.user = null
          state.isZedeck = false
          state.isAdmin = null
          state.isChurchClerk = null
          state.isMember = null
        }
      }
    }
  }
}

export const watchAuthMixin = {
  created() {
    Tracker.autorun(() => {
      const user = Meteor.user()
      this.$store.commit('auth/updateUser', {user})
    })
  }
}

export const authForTemplateMixin = {
  computed: {
    auth() {
      return this.$store.state.auth
    }
  }
}