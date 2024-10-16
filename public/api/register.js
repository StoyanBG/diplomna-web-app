import { admin } from '../firebaseAdmin.js'; // Ensure this points to your Firebase admin setup

export default async (req, res) => {
  // Check for the request method
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      // Create a new user using Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      // Store additional user data in Firebase Realtime Database
      await admin.database().ref('users/' + userRecord.uid).set({
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      // Set userId in the session after successful registration
      req.session.userId = userRecord.uid;

      res.status(201).json({ message: 'User registered successfully', userId: userRecord.uid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
