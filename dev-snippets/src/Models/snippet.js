const { Schema, model } = require("mongoose");

const SnippetSchema = new Schema({
    title: {
        type: String,
        required: "Title is required",
        trim: true,
    },
    description: {
        type: String,
        required: "Description is required",
        trim: true,
    },
    code: {
        type: String,
        required: "Code is required",
        trim: true,
    },
    language: {
        type: String,
        required: "Language is required",
        trim: true,
    },
    tags: {
        type: String,
        required: "Tags are required",
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

const Snippet = model("Snippet", SnippetSchema);
module.exports = Snippet;
    