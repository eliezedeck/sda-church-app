import Vue from 'vue'
import Router from 'vue-router'

import Church from '../components/Church'
import Department from '../components/Department'

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
        }
      ],
      component: Church
    }
  ]
})
