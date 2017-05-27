import firebase from 'firebase' // FIXME: modularity?


// Begin Firebase initialization before setting-up stores
const app = firebase.initializeApp({
  apiKey: "AIzaSyDCS24nSHDgSdHvOzeopiKtx43KcY2R7vY",
  authDomain: "sdachurchapp.firebaseapp.com",
  databaseURL: "https://sdachurchapp.firebaseio.com",
  projectId: "sdachurchapp",
  storageBucket: "sdachurchapp.appspot.com",
  messagingSenderId: "945746518532"
})


export default app
