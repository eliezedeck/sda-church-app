import _ from 'lodash'
import Vue from 'vue'


Vue.mixin({
  computed: {
    lo() {
      return _
    },

    console() {
      return console
    }
  }
})
