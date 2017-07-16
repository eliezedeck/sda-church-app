import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'

import {roles} from './data/roles.js'


Vue.filter('named-roles', (rolesArray) => {
  /* TAG: i18n */
  const named = _.map(rolesArray, r => _.get(roles, r, '[Role]'))
  return _.join(named, ', ')
})

Vue.filter('nice-date', (date) => {
  /* TAG: i18n */
  return moment(date).format('Do, MMMM YYYY [at] HH:mm:ss')
})
