import Vue from 'vue'
import Gun from 'gun/gun'

// Create a global instance of GUN
const gun = new Gun({
  peers: ['http://localhost:8000/gun']
})

Vue.use({
  install: function (Vue) {
    Vue.prototype.$gun = gun
  }
})
