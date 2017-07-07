import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'

import {Roles} from 'meteor/alanning:roles'


export default {
  state: {
    initialized: false,
    user: null,
    isZedeck: false,
    isSeller: false,
    isOwner: false,
  },

  mutations: {
    updateUser(state, {user}) {
      if (user !== undefined) {
        state.initialized = true
        if (user !== null) {
          // Logged-in
          state.user = user
          state.isZedeck = Roles.userIsInRole(user._id, ['zedeck'])
          state.isSeller = Roles.userIsInRole(user._id, ['seller'])
          state.isOwner = Roles.userIsInRole(user._id, ['owner'])
        }
        else {
          state.user = null
          state.isZedeck = false
          state.isSeller = false
          state.isOwner = false
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