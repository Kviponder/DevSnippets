const router = require('express').Router();
const apiRoutes = require('./api');
const loginRoute = require("./login");
const signupRoute = require("./signup");
const path = require('path'); // Import the path module

router.use('/api', apiRoutes);
router.use('/login', loginRoute);
router.use('/signup', signupRoute);

// serve up react front-end in production
router.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });

module.exports = router;
