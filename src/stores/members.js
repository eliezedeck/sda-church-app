import Vue from 'vue'
import Vuex from 'vuex'
import {createStoreWithFirebaseSubscription} from './firebase'


Vue.use(Vuex)

export const SMembers = createStoreWithFirebaseSubscription('members', '/members')

export const SMembersMixin = {
  computed: {
    membersLookup: () => (id) => {
      return SMembers.state.lookup[id]
    }
  }
}
