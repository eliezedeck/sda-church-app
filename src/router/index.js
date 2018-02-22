import Vue from 'vue'
import Router from 'vue-router'

import Church from '../components/Church'
import Department from '../components/Department'
import TreasuryInputSessions from '../components/TreasuryInputSessions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Church',
      children: [
        {
          path: '/department/:departmentId',
          name: 'Department',
          component: Department
        },

        {
          path: '/treasury/input-sessions',
          name: 'TreasuryInputSessions',
          component: TreasuryInputSessions
        }
      ],
      component: Church
    }
  ]
})
