"use strict";

var mongoose = require("mongoose");

var postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxlength: [160, "Title must be at most 160 characters."]
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
      maxlength: [10000, "Content must be at most 10000 characters."]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required."]
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: [true, "Community is required."]
    },
    anonymous: {
      type: Boolean,
      default: false
    },
    upvotes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ community: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

postSchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.__v;
    return ret;
  }
});

postSchema.statics.createPost = function (record) {
  return this.create(record);
};

postSchema.statics.listPosts = function () {
  return this.find()
    .sort({ createdAt: -1 })
    .populate("author", "username email bio profileImage createdAt")
    .populate("community", "name icon");
};

module.exports = mongoose.model("Post", postSchema);
