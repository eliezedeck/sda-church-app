import Vue from 'vue'
import VueFire from 'vuefire'
import * as firebase from 'firebase'

export default firebase.initializeApp({
  apiKey: 'AIzaSyDCS24nSHDgSdHvOzeopiKtx43KcY2R7vY',
  authDomain: 'sdachurchapp.firebaseapp.com',
  databaseURL: 'https://sdachurchapp.firebaseio.com',
  projectId: 'sdachurchapp',
  storageBucket: 'sdachurchapp.appspot.com',
  messagingSenderId: '945746518532'
})

Vue.use(VueFire)
console.log('App initialized')
