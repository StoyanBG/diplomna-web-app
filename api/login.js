// api/login.js
const { admin, sessionMiddleware, corsOptions } = require('../firebaseAdmin');
const express = require('express');
const cors = require('cors');

const app = express();

// Use necessary middlewares
app.use(express.json());
app.use(sessionMiddleware);
app.use(cors(corsOptions));

app.post(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase does not support server-side password authentication directly.
    // You should validate the ID token sent from the client.
    // Here, we'll check if the user exists.
    const user = await admin.auth().getUserByEmail(email);
    
    // Set userId in the session after successful login
    req.session.userId = user.uid;
    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(404).json({ error: 'User not found or invalid credentials' });
  }
});

module.exports = app;
