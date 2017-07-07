import Vue from 'vue'


// Provides v-focus directive, to be used on <input /> tags
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})
