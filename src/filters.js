import Vue from 'vue'
import moment from 'moment'


/**
 * Convert a server timestamp to local date display
 */
Vue.filter('ts2date', function (value) {
  return moment(value).format('Do MMMM YYYY - HH:mm:ss')
})
