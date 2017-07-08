import _ from 'lodash'
import Vue from 'vue'

import {roles} from './data/roles.js'


Vue.filter('named-roles', (rolesArray) => {
  /* TAG: i18n */
  const named = _.map(rolesArray, r => _.get(roles, r, '[Role]'))
  return _.join(named, ', ')
})
