import _ from 'lodash'
import Vue from 'vue'

import {roles} from './data/roles.js'


Vue.filter('named-role', (value) => {
  return _.get(roles, value, '[RÔLE]')
})
