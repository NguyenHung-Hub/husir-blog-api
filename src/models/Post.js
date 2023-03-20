const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const Category = require("./Category");

mongoose.plugin(slug);

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: true,
        },

        categories: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },

        slug: {
            type: String,
            slug: "title",
            unique: true,
        },

        hidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", PostSchema);
