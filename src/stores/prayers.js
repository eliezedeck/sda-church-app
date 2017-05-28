import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import FApp, {snapshotListToArray} from './firebase'
import {vm} from '../main.js'


Vue.use(Vuex)

export const SPrayers = new Vuex.Store({
  state: {
    prayers: []
  },

  mutations: {
    UPDATE_PRAYERS_LIST(state, {array}) {
      if (array) {
        state.prayers = array
      }
    }
  }
})


// Firebase Data Initialization
SPrayers.fdi = _.once(() => {
  console.log('Starting /prayers ...')
  FApp.database().ref('/prayers').on('value', function (snapshot) {
    SPrayers.commit('UPDATE_PRAYERS_LIST', {array: snapshotListToArray(snapshot)})
  })
})
