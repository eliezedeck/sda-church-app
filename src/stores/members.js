import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import FApp, {snapshotListToArrayAndLookup} from './firebase'


Vue.use(Vuex)

export const SMembers = new Vuex.Store({
  state: {
    initialized: false,
    members: [],
    lookup: {}
  },

  getters: {
    selected: (state) => (id) => {
      if (id) {
        return state.lookup[id]
      }
      return null
    }
  },

  mutations: {
    UPDATE_MEMBERS_LIST(state, {array, lookup}) {
      state.initialized = true
      if (array) {
        state.members = array
        state.lookup = lookup
      }
    }
  }
})


// Firebase Data Initialization
SMembers.fdi = _.once(() => {
  console.log('Starting /members ...')
  FApp.database().ref('/members').on('value', function (snapshot) {
    SMembers.commit('UPDATE_MEMBERS_LIST', snapshotListToArrayAndLookup(snapshot))
  })
})
