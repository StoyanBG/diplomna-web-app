const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://diplomna-web-app-db-default-rtdb.europe-west1.firebasedatabase.app/'
});

const db = admin.database(); // Initialize Firebase Realtime Database

const app = express();
app.use(cors({
  origin: 'https://diplomna-web-app.vercel.app'
}));

// Middleware for session management
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true
}));

// Middleware for parsing JSON body
app.use(express.json());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for user registration
app.post('/register', async (req, res) => {
 
  const { name, email, password } = req.body;

  try {
    // Create a new user using Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Store additional user data in Firebase Realtime Database
    await db.ref('users/' + userRecord.uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    // Set userId in the session after successful registration
    req.session.userId = userRecord.uid;

    res.json({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase doesn't support password login on the server-side; typically, client-side token validation is done.
    // You would send the ID token from the client and verify it here.
    const user = await admin.auth().getUserByEmail(email);

    // Assuming the user is authenticated on the client-side and you received a token
    req.session.userId = user.uid;
    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(404).json({ error: 'User not found or invalid credentials' });
  }
});

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
// Check user authentication
app.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Route for saving user choices
app.post('/save-choice', authenticateUser, (req, res) => {
  const { lineIds } = req.body;
  const userId = req.session.userId;

  try {
    const userChoicesRef = db.ref('choices/' + userId);
    lineIds.forEach(lineId => {
      userChoicesRef.push({ lineId });
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching selected lines for the authenticated user
app.get('/selected-lines', authenticateUser, async (req, res) => {
  const userId = req.session.userId;

  try {
    const snapshot = await db.ref('choices/' + userId).once('value');
    const choices = snapshot.val() || {};
    const lineIds = Object.values(choices).map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching complaints
// Route for fetching complaints
app.get('/get-complaints', authenticateUser, async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});


// Route for sending a message
app.post('/send-message', authenticateUser, async (req, res) => {
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
    res.status(500).send('Server error');
  }
});

// Route for responding to a message
// Route for responding to a message
app.post('/respond-message', authenticateUser, async (req, res) => {
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


// Start server
// Comment or remove this part in Vercel deployment
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
