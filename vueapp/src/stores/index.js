import Vue from 'vue'
import Vuex from 'vuex'

import authStore, {authForTemplateMixin} from './auth'
import dataMembers from './data/members'

Vue.use(Vuex)


// Register global mixins
Vue.mixin(authForTemplateMixin)


export default new Vuex.Store({
  modules: {
    data: {
      namespaced: true,
      modules: {
        members: {
          namespaced: true,
          ...dataMembers
        }
      }
    },

    auth: {
      namespaced: true,
      ...authStore
    }
  }
})
