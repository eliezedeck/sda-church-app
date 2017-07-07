import Vue from 'vue'
import Vuex from 'vuex'

import authStore, {authForTemplateMixin} from './auth'
import pageArticlesStore from './page-articles'

Vue.use(Vuex)


// Register global mixins
Vue.mixin(authForTemplateMixin)


export default new Vuex.Store({
  modules: {
    auth: {
      namespaced: true,
      ...authStore
    },

    pageArticles: {
      namespaced: true,
      ...pageArticlesStore
    }
  }
})
