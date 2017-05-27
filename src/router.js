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
      name: 'Index',
      component: Index
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },

    {
      path: '/prayers',
      name: 'Prayers',
      component: Prayers
    },
  ]
})
