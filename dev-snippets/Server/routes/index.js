const router = require('express').Router();
const apiRoutes = require('./api');
const loginRoute = require("./login");
const signupRoute = require("./signup");

router.use('/api', apiRoutes);
router.use('/login', loginRoute);
router.use('/signup', signupRoute);

module.exports = router;
