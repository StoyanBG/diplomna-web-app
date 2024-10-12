// api/get-complaints.js
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

// Route for fetching complaints
app.get('/', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.ref('messages').orderByChild('receiver').equalTo('admin').once('value');
    const messages = snapshot.val() || {};

    // Create an array to hold the complaints
    const complaints = await Promise.all(
      Object.entries(messages).map(async ([id, messageData]) => {
        // Fetch sender's name from the users database
        const senderSnapshot = await db.ref('users/' + messageData.sender).once('value');
        const senderData = senderSnapshot.val() || {};

        // Fetch responses and their responder names
        const responses = messageData.responses || {};
        const responsesWithNames = await Promise.all(
          Object.entries(responses).map(async ([resId, resData]) => {
            const responderSnapshot = await db.ref('users/' + resData.responder).once('value');
            const responderData = responderSnapshot.val() || {};
            return {
              ...resData,
              responderName: responderData.name // Fetch responder's name
            };
          })
        );

        return {
          id,
          subject: messageData.subject,
          message: messageData.message,
          sender: senderData.name || 'Unknown', // Use sender's name
          responses: responsesWithNames // Use responses with responder names
        };
      })
    );

    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
