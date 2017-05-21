// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Initialize stores in correct order
import './stores/firebase'
import './stores/auth'


Vue.config.productionTip = false

export const vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
