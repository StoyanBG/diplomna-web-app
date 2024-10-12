// api/selected-lines.js
const express = require('express');
const { admin, db, sessionMiddleware } = require('../firebaseAdmin');

const app = express();

// Use necessary middlewares
app.use(express.json());
app.use(sessionMiddleware);

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Route for fetching selected lines for the authenticated user
app.get('/', authenticateUser, async (req, res) => {
  const userId = req.session.userId;

  try {
    const snapshot = await db.ref('choices/' + userId).once('value');
    const choices = snapshot.val() || {};
    const lineIds = Object.values(choices).map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    console.error('Error fetching selected lines:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
