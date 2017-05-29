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

export function snapshotListToArrayAndLookup(snapshot) {
  let array = []
  let lookup = {}

  snapshot.forEach((csnap) => {
    let entry = csnap.val()
    entry.id = csnap.key

    array.push(entry)
    lookup[csnap.key] = entry
  })

  return {
    array,
    lookup
  }
}

export {firebase}
