import Vue from 'vue'
import Vuex from 'vuex'

import authStore, {authForTemplateMixin} from './auth'

Vue.use(Vuex)


// Register global mixins
Vue.mixin(authForTemplateMixin)


export default new Vuex.Store({
  modules: {
    auth: {
      namespaced: true,
      ...authStore
    }
  }
})
