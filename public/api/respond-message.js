// api/respond-message.js
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

// Route for responding to a message
app.post('/', authenticateUser, async (req, res) => {
  const { messageId, response } = req.body;
  const responder = req.session.userId;

  try {
    const messageRef = db.ref('messages/' + messageId);
    const messageSnapshot = await messageRef.once('value');

    // Check if the message exists
    if (!messageSnapshot.exists()) {
      return res.status(404).send('Message not found');
    }

    // Log before pushing the response
    console.log(`Responding to message ID: ${messageId} with response: ${response}`);
    
    await messageRef.child('responses').push({
      responder,
      response_message: response,
      createdAt: new Date().toISOString(),
    });

    res.status(200).send('Response sent successfully');
  } catch (error) {
    console.error('Error responding to message:', error);
    res.status(500).send('Server error');
  }
});

module.exports = app;
