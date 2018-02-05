import * as firebase from 'firebase'

export default firebase.initializeApp({
  apiKey: 'AIzaSyDCS24nSHDgSdHvOzeopiKtx43KcY2R7vY',
  authDomain: 'sdachurchapp.firebaseapp.com',
  databaseURL: 'https://sdachurchapp.firebaseio.com',
  projectId: 'sdachurchapp',
  storageBucket: 'sdachurchapp.appspot.com',
  messagingSenderId: '945746518532'
})

console.log('App initialized')
