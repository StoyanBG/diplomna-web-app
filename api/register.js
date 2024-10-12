// api/register.js
const { admin, db, sessionMiddleware, corsOptions } = require('../firebaseAdmin');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(sessionMiddleware);
app.use(cors(corsOptions));

app.post(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await db.ref('users/' + userRecord.uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    req.session.userId = userRecord.uid;
    res.json({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
