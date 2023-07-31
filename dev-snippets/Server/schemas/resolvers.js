const { AuthenticationError } = require("apollo-server-express");
const { User, Snippet } = require("../models");
const { signToken } = require("../utils/auth");



const resolvers = {
  Query: {
    users: async () => {
      const userData = await User.find({})
        .select("-__v -password")
        .populate("snippets");
      return userData;
    },
    user: async (parent, { username }) => {
      const params = username ? { username } : {};
      return await User.findOne(params)
        .select("-__v -password")
        .populate("snippets");
    },
    snippets: async (parent, { username }) => {
      const params = username ? { username } : {};
      return await Snippet.find(params).sort({ createdAt: -1 });
    },
    snippet: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return await Snippet.findOne(params);
    },
    me: async () => {
      try {
        // Fetch all snippets from the database
        const snippets = await Snippet.find();

        // Return an object with the snippets data
        return {
          snippets,
        };
      } catch (error) {
        // Handle any potential errors
        throw new Error("An error occurred while fetching snippets.");
      }
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token=signToken(user)
      return { token, user };

    },
    login: async (parent, { email, password }) => {
      // Since we are removing authentication, we won't actually log in the user.
      // Instead, we'll just create a new user object with the provided email and a placeholder username.
      const user = await User.findOne({
        email
      })
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addSnippet: async (parent, args) => {
      // Since we are removing authentication, we'll create a new snippet without associating it with any user.
      const newSnippet = await Snippet.create(args);
      return newSnippet;
    },
    removeSnippet: async (parent, { snippetId }) => {
      // Since we are removing authentication, we'll remove the snippet without any user association.
      const deletedSnippet = await Snippet.findByIdAndDelete(snippetId);
      return deletedSnippet;
    },
  },
};

module.exports = resolvers;
