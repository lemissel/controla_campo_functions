require('dotenv').config();

const firebase = require('firebase-admin');

// firebase.initializeApp({
//     credential: firebase.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// });

firebase.initializeApp();

module.exports = firebase;