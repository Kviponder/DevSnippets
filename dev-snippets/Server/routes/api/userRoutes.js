const router = require('express').Router();
const { 
    getAllUsers,
    createUser,
    loginUser
} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers);
router.route('/login').post(loginUser);
router.route('/signup').post(createUser);

module.exports = router;
