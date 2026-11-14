"use strict";

var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
      maxlength: [2000, "Content must be at most 2000 characters."]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required."]
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required."]
    }
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

commentSchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.__v;
    return ret;
  }
});

commentSchema.statics.createComment = function (record) {
  return this.create(record);
};

commentSchema.statics.listByPost = function (postId) {
  return this.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate("author", "username createdAt");
};

module.exports = mongoose.model("Comment", commentSchema);
