const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const databaseRootRef = admin.database().ref()

exports.onCreateUserAccount = functions.auth.user().onCreate(event => {
    const uid = event.data.uid
    const newUserRef = databaseRootRef.child(`/users/${uid}`)
    return newUserRef.set({
        deviceToken: "",
        userPhoto: ""
    })
})

exports.onDeleteUserAccountClearDatabase = functions.auth.user().onDelete(event => {
    const uid = event.data.uid
    const userRef = databaseRootRef.child(`/users/${uid}`)
    userRef.remove()

    const filePath = `users/${uid}.jpg`
    const bucket = gcs.bucket('naturafirebase.appspot.com')
    const file = bucket.file(filePath)

    if (file.resourceState === 'not_exists') {
        console.log(`File not exists ${uid}`)
        return
    } else {
        return file.delete()
    }
})
