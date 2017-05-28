import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import FApp from './firebase'
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
    UPDATE_PRAYERS_LIST(state, {list, lookup}) {
      state.initialized = true
      if (list) {
        state.prayers = list
        state.lookup = lookup
      }
    }
  }
})


// Firebase Data Initialization
SPrayers.fdi = _.once(() => {
  console.log('Starting /prayers ...')
  FApp.database().ref('/prayers').on('value', function (snapshot) {
    let list = []
    let lookup = {}

    _.forEach(snapshot.val(), (p, k) => {
      p.id = k
      // Add markedown-rendered content
      p.contentMarked = marked(p.content)

      list.push(p)
      lookup[p.id] = p
    })

    SPrayers.commit('UPDATE_PRAYERS_LIST', {list, lookup})
  })
})
