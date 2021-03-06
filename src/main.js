// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'
import router from './router'
import marked from 'marked'

// Initialize stores in correct order
import './stores/firebase'
import './stores/auth'

// Global components
import './components/widgets/register.js'

// Global filters
import './filters'


Vue.use(VueFire)
Vue.config.productionTip = false

// Default marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true,
  smartLists: true
})


export const vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
