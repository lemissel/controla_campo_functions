const functions = require('firebase-functions');
const app = require('./src/app.config');

exports.api = functions.https.onRequest(app);
