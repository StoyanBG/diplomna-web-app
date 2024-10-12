// api/send-message.js
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

// Route for sending a message
app.post('/', authenticateUser, async (req, res) => {
  const { subject, message } = req.body;
  const sender = req.session.userId;

  try {
    await db.ref('messages').push({
      sender,
      receiver: 'admin',
      subject,
      message,
      createdAt: new Date().toISOString(),
    });

    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Server error');
  }
});

module.exports = app;
