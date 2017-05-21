const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Initialize Admin with configuration
admin.initializeApp(functions.config().firebase)


exports.fillInitialUserProfile = functions.auth.user().onCreate((event) => {
  const user = event.data
  const db = admin.database()

  return db.ref(`/members/${user.uid}`).set({
    displayName: user.displayName || `Member (${user.phoneNumber})`,
    roles: []
  })
})
