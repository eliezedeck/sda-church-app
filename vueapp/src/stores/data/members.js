import _ from 'lodash'
import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'

export default {
  state: {
    lookup: {}
  },

  mutations: {
    update(state, members) {
      const lookup = {}
      _.forEach(members, m => {
        lookup[m._id] = m
      })

      state.lookup = lookup
    }
  }
}

export function watchUsers(vm) {
  Tracker.autorun(() => {
    const users = Meteor.users.find({}, {
      sort: {'profile.displayName': 1}
    }).fetch()
    vm.$store.commit('data/members/update', users)
  })
}

export const membersMixin = {
  meteor: {
    membersLookup() {
      return this.$store.state.data.members.lookup
    }
  }
}
