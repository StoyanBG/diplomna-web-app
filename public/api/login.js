import { admin } from './firebaseAdmin.js'; // Ensure this points to your Firebase admin setup

export default async (req, res) => {
  // Check for the request method
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Fetch user by email
      const userRecord = await admin.auth().getUserByEmail(email);

      // Set userId in session (you might want to validate the password on the client side)
      req.session.userId = userRecord.uid;

      res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      // Handle errors (user not found or invalid credentials)
      res.status(404).json({ error: 'User not found or invalid credentials' });
    }
  } else {
    // Handle method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
