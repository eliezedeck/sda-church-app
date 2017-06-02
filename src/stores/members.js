import Vue from 'vue'
import Vuex from 'vuex'
import {createStoreWithFirebaseSubscription} from './firebase'


Vue.use(Vuex)

export const SMembers = createStoreWithFirebaseSubscription({
  key: 'members',
  path: '/members'
})

export const SMembersMixin = {
  computed: {
    membersLookup: () => (id) => {
      return SMembers.state.lookup[id]
    }
  }
}
