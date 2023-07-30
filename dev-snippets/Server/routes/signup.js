const express = require('express');
const { signToken } = require('../utils/auth');
const path = require('path'); // Import the 'path' module

const router = express.Router();

router.get('/', (req, res) => {
    // Render the login form using the 'login' Handlebars template
    res.render('signup');
  });

  module.exports = router;