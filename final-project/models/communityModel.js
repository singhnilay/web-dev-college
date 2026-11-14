"use strict";

var mongoose = require("mongoose");

var communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Community name is required."],
      trim: true,
      maxlength: [80, "Community name must be at most 80 characters."]
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description must be at most 500 characters."]
    },
    icon: {
      type: String,
      trim: true,
      default: ""
    },
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

communitySchema.index({ name: 1 }, { unique: true });

communitySchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Community", communitySchema);
