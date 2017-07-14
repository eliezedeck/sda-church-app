import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'

Vue.use(Router)

function load(component) {
  return () => import(`./components/${component}.vue`)
}

/* TAG: i18n */
export const routes = [
  {
    path: '/',
    component: Home
  },

  {
    path: '/auth',
    component: load('Authentication')
  },

  {
    path: '/auth/registered',
    component: load('Registered')
  },

  {
    path: '/admin/members/:userId?',
    component: load('Members')
  },

  {
    highlight: '/prayer-requests',
    path: '/prayer-requests/:selectedId?',
    label: 'Prayer Requests',
    link: '/prayer-requests',
    component: load('PrayerRequests')
  }
]


export default new Router({
  routes
})
