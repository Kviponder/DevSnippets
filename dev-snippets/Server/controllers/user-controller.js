const { User } = require('../models');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcryptjs');

module.exports = {
  async getAllUsers(req, res) {
    const allUsers = await User.find({});

    if (!allUsers) {
      return res.status(400).json({ message: 'No users found' });
    }

    res.status(200).json(allUsers);
  },

  async createUser({ body }, res) {
    const { username, email, password } = body; // Step 2: Extract username, email, and password

    try {
      // Step 3: Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10); // Use 10 salt rounds (you can adjust as needed)

      // Step 4: Create the user in the database with the hashed password
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      if (!user) {
        return res.status(400).json({ message: 'Something is wrong!' });
      }

      // Generate a token for the newly created user
      const token = signToken(user);

      res.json({ user, token });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async loginUser({ body }, res) {
    const { username, password } = body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await user.comparePassword(password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // If the password is valid, generate a token for the user using the signToken function
      const token = signToken(user);
      console.log(token);
  
      // Respond with the token in the JSON response
      res.json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
