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
    user: async (parent, { username }, context) => {
      if (context.user) {
        const params = username ? { username } : {};
        return await User.findOne(params)
          .select("-__v -password")
          .populate("snippets");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    snippets: async (parent, { username }) => {
      const params = username ? { username } : {};
      return await Snippet.find(params).sort({ createdAt: -1 });
    },
    snippet: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return await Snippet.findOne(params);
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("snippets");

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.comparePassword(password); // Use the comparePassword method defined in the User model
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    addSnippet: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { snippets: args } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeSnippet: async (parent, { snippetId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { snippets: { snippetId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
