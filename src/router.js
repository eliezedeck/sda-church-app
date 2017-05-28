import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index.vue'
import Login from '@/components/Login.vue'
import Profile from '@/components/Profile.vue'
import Prayers from '@/components/Prayers.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      component: Index
    },

    {
      path: '/login',
      component: Login
    },

    {
      path: '/profile',
      component: Profile
    },

    {
      path: '/prayers',
      component: Prayers
    },

    {
      path: '/prayers/:id',
      component: Prayers
    },
  ]
})
