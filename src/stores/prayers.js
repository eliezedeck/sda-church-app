import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import FApp, {createStoreWithFirebaseSubscription} from './firebase'
import marked from 'marked'


Vue.use(Vuex)

export const SPrayers = createStoreWithFirebaseSubscription({
  key: 'prayers',
  path: '/prayers',

  lookupFunc: (snapshot) => {
    let lookup = {}

    _.forEach(snapshot.val(), (p, k) => {
      p.$id = k
      // Add markedown-rendered content
      p.contentMarked = marked(p.content)
      lookup[k] = p
    })

    return lookup
  }
})
