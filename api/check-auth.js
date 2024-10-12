// api/check-auth.js
const express = require('express');
const { sessionMiddleware } = require('../firebaseAdmin');

const app = express();

// Use session middleware
app.use(sessionMiddleware);

app.get((req, res) => {
  if (req.session.userId) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = app;
