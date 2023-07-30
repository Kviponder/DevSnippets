const { User } = require('../models');

module.exports = {
async getAllUsers(req, res) {
  const allUsers = await User.find({});

  if (!allUsers) {
    return res.status(400).json({ message: 'No users found' });
  }

  res.status(200).json(allUsers);
},
}