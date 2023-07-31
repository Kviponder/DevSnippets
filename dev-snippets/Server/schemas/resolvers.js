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
      // Ensure that all required fields are provided in the arguments
      const { username, email, password } = args;
      if (!username || !email || !password) {
        throw new Error("Username, email, and password are required.");
      }

      try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User with this email already exists.");
        }

        // Create the new user
        const newUser = await User.create(args);
        return newUser;
      } catch (error) {
        throw new Error("Could not create user. Please try again.");
      }
    },
    login: async (parent, { email, password }) => {
      // Removed authentication, as it is not required anymore.
      // Instead, we'll just create a new user object with the provided email and a placeholder username.
      const user = { _id: "placeholderId", username: "Guest" };
      return { user };
    },
    addSnippet: async (parent, args) => {
      // Removed authentication, as it is not required anymore.
      // Create a new snippet without associating it with any user.
      const newSnippet = await Snippet.create(args);
      return newSnippet;
    },
    updateSnippet: async (parent, args) => {
      // If you have an updateSnippet resolver, you can remove the authentication from it too.
      // Update the snippet using args and return the updated snippet.
      const updatedSnippet = await Snippet.findByIdAndUpdate(args._id, args, { new: true });
      return updatedSnippet;
    },
    removeSnippet: async (parent, { _id }) => {
      // Removed authentication, as it is not required anymore.
      // Remove the snippet without any user association.
      const deletedSnippet = await Snippet.findByIdAndDelete(_id);
      return deletedSnippet;
    },
  },
};

module.exports = resolvers;