// firebaseAdmin.js
const admin = require('firebase-admin');
const session = require('express-session');
const cors = require('cors');

const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://diplomna-web-app-db-default-rtdb.europe-west1.firebasedatabase.app/'
});

const db = admin.database();

const corsOptions = {
  origin: 'https://diplomna-web-app.vercel.app',
};

const sessionMiddleware = session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
});

module.exports = { admin, db, sessionMiddleware, corsOptions };
