import _ from 'lodash'
import firebase from 'firebase' // FIXME: modularity?
import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


// Begin Firebase initialization before setting-up stores
const app = firebase.initializeApp({
  apiKey: "AIzaSyDCS24nSHDgSdHvOzeopiKtx43KcY2R7vY",
  authDomain: "sdachurchapp.firebaseapp.com",
  databaseURL: "https://sdachurchapp.firebaseio.com",
  projectId: "sdachurchapp",
  storageBucket: "sdachurchapp.appspot.com",
  messagingSenderId: "945746518532"
})

export default app
export {firebase}

/**
 * Returns an instance of Vuex store, ready for Firebase list subscription to the given path
 * @param key Name of the objects on the path, like "users", "articles", etc...
 * @param path Path of the list on Firebase
 * @param getters Custom getters to inject into the store state, set to null if not needed
 * @param mutations Custom mutations, set to null if not needed
 * @param actions Custom actions, set to null if not needed
 * @param lookupFunc Function that will be used to convert the spanshot to `lookup`
 * @return {Store}
 */
export function createStoreWithFirebaseSubscription({key, path, getters, mutations, actions, lookupFunc}) {
  let state = {
    initialized: false,
    count: 0
  }
  state[key] = {} // this is the kind of "users", "articles", etc...

  const storeClass = {
    state
  }

  storeClass.getters = _.assign({
    // Add one default getter
    selected: (state) => (id) => {
      if (id) {
        return state[key][id]
      }
      return null
    }
  }, getters || {})

  storeClass.mutations = _.assign({
    UPDATE_LIST(state, {lookup}) {
      // Add an "$id" to each data
      _.forEach(lookup, (v, k) => { if (typeof v === 'object') v.$id = k })

      state.initialized = true
      state[key] = lookup
      state.count = _.size(lookup)
    }
  }, mutations || {})

  if (actions)
    storeClass.actions = actions

  const store = new Vuex.Store(storeClass)

  // Create an initialization function
  store.fdi = _.once(() => {
    console.log(`Starting ${path} ...`)
    app.database().ref(path).on('value', function (snapshot) {
      if (typeof lookupFunc === 'function')
        store.commit('UPDATE_LIST', {lookup: lookupFunc(snapshot)})
      else
        store.commit('UPDATE_LIST', {lookup: snapshot.val()})
    })
  })

  return store
}
