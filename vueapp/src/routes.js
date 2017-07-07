import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'
import Authentication from './components/Authentication.vue'
import Registered from './components/Registered.vue'
import Articles from './components/Articles.vue'

import AdminUsers from './components/Admin--Users.vue'

Vue.use(Router)


/* TAG: i18n */

export const routes = [
  {
    path: '/',
    component: Home
  },

  {
    path: '/auth',
    component: Authentication
  },

  {
    path: '/auth/registered',
    component: Registered
  },

  {
    path: '/admin/users',
    component: AdminUsers
  },

  {
    path: '/admin/users/:userId',
    component: AdminUsers
  },

  {
    highlight: '/articles/',
    path: '/articles/:section',
    label: 'Articles',
    link: '/articles/types',
    component: Articles
  }
]


export default new Router({
  routes
})
