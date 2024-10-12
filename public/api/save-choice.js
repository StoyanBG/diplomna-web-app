// api/save-choice.js
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

// Route for saving user choices
app.post('/', authenticateUser, async (req, res) => {
  const { lineIds } = req.body;
  const userId = req.session.userId;

  try {
    const userChoicesRef = db.ref('choices/' + userId);
    
    // Clear existing choices for the user (optional, based on your requirement)
    await userChoicesRef.set(null); 

    // Save the new choices
    lineIds.forEach(lineId => {
      userChoicesRef.push({ lineId });
    });
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user choices:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
