import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import {createStoreWithFirebaseSubscription} from './firebase'


Vue.use(Vuex)

export const SPrayers = createStoreWithFirebaseSubscription({
  key: 'prayers',
  path: '/prayers'
})

export const SPrayerViews = createStoreWithFirebaseSubscription({
  key: 'prayerViews',
  path: '/prayerViews'
})
