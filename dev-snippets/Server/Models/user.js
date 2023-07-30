const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "Username is required",
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: "Email is required",
      match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    },
    password: {
      type: String,
      required: "Password is required",
      validate: [({ length }) => length >= 6, "Password should be longer."],
    },
    snippets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Snippet",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
//  ideas for virtuals:
// UserSchema.virtual("snippetCount").get(function () {}

// Add the comparePassword method to the userSchema
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

const User = model("User", UserSchema);
module.exports = User;
