const router = require('express').Router();
const { getAllSnippets } = require('../../controllers/snippet-controller');

router.route('/').get(getAllSnippets);

module.exports = router;
