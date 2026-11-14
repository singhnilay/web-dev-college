"use strict";

var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var config = require("../config");

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      minlength: [3, "Username must be at least 3 characters."],
      maxlength: [20, "Username must be at most 20 characters."],
      match: [/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscores only."]
    },
    usernameLower: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."]
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Bio must be at most 500 characters."]
    },
    profileImage: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ usernameLower: 1 }, { unique: true });

userSchema.pre("validate", function (next) {
  if (this.username) this.usernameLower = String(this.username).trim().toLowerCase();
  next();
});

userSchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.password;
    delete ret.usernameLower;
    delete ret.__v;
    return ret;
  }
});

function hashPassword(plain) {
  return bcrypt.hash(plain, config.BCRYPT_ROUNDS);
}

function passwordsMatch(plain, stored) {
  return bcrypt.compare(plain, stored);
}

userSchema.statics.hashPassword = hashPassword;
userSchema.statics.passwordsMatch = passwordsMatch;

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: String(email || "").trim().toLowerCase() }).select("+password");
};

userSchema.statics.findByUsernameLower = function (username) {
  return this.findOne({ usernameLower: String(username || "").trim().toLowerCase() });
};

userSchema.statics.createUser = function (record) {
  return this.create(record);
};

module.exports = mongoose.model("User", userSchema);
