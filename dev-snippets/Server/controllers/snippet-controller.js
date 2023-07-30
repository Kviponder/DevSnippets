const { Snippet } = require('../models');

module.exports = {
async getAllSnippets(req, res) {
  const allSnippets = await Snippet.find({});

  if (!allSnippets) {
    return res.status(400).json({ message: 'No snippets found' });
  }

  res.status(200).json(allSnippets);
},
}