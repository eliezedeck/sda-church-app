import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import FApp, {snapshotListToArray} from './firebase'
import {vm} from '../main.js'
import marked from 'marked'


Vue.use(Vuex)

export const SPrayers = new Vuex.Store({
  state: {
    initialized: false,
    prayers: [],
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
    UPDATE_PRAYERS_LIST(state, {array, lookup}) {
      state.initialized = true
      if (array) {
        state.prayers = array
        state.lookup = lookup
      }
    }
  }
})


// Firebase Data Initialization
SPrayers.fdi = _.once(() => {
  console.log('Starting /prayers ...')
  FApp.database().ref('/prayers').on('value', function (snapshot) {
    let list = snapshotListToArray(snapshot)
    let lookup = {}

    // Add markedown-rendered content
    _.forEach(list, p => {
      p.contentMarked = marked(p.content)
      lookup[p.id] = p
    })

    SPrayers.commit('UPDATE_PRAYERS_LIST', {
      array: list,
      lookup: lookup
    })
  })
})
