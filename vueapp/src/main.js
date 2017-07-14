import 'meteor-imports'
import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'

import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './stores'
import './directives'
import './filters'
import './data/meteor'
import './mixins'


// the vue-meteor-tracker assumes Meteor stuffs are available globally
window.Meteor = Meteor
window.Tracker = Tracker

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
