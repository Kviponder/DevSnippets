const express = require('express');
const { signToken } = require('../utils/auth');
const path = require('path');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// GET route for rendering the login form
router.get('/', (req, res) => {
  // Check if the user is logged in
  if (req.user) {
    // Assuming you have access to the logged-in user's username, store it in a variable
    const loggedInUsername = req.user.username; // Adjust this based on how you handle authentication

    // Render the login form using the 'login' Handlebars template and pass the 'username' variable
    return res.render('login', { username: loggedInUsername });
  }

  // If the user is not logged in, render the login form without the 'username' variable
  res.render('login');
});

// POST route for handling login form submission
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If the password is valid, generate a token for the user and send it back in the response
    const token = signToken(user);
    return res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
