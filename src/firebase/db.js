import firebase from 'firebase'
import app from './app'
import 'firebase/firestore'
import 'firebase/database'

export const fdb = app.firestore()
export const rdb = app.database()

export function firestoreServerTS () {
  return firebase.firestore.FieldValue.serverTimestamp()
}
