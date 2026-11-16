"use strict";

var Community = require("../models/communityModel");
var config = require("../config");

var DESCRIPTIONS = {
  "Campus Life": "Everything happening around campus — housing, dining, traditions, and the small stuff that actually fills a week.",
  Academics: "Notes, doubts, resources, and the occasional academic SOS.",
  Events: "Find events, announcements, and things worth leaving your room for.",
  Memes: "Because college life is a little unserious sometimes.",
  Opportunities: "Internships, research, competitions, and other cool finds.",
  Questions: "Ask away. Someone probably has the answer."
};

var ICONS = {
  "Campus Life": "🎓",
  Academics: "📚",
  Events: "🎉",
  Memes: "😂",
  Opportunities: "🚀",
  Questions: "🙋"
};

function defaults() {
  return config.COMMUNITIES.map(function (name) {
    return {
      name: name,
      description: DESCRIPTIONS[name] || "",
      icon: ICONS[name] || "",
      members: []
    };
  });
}

function seedCommunities() {
  return Promise.all(
    defaults().map(function (item) {
      return Community.findOne({ name: item.name }).then(function (existing) {
        if (existing) return existing;
        return Community.create(item);
      });
    })
  );
}

module.exports = seedCommunities;
module.exports.defaults = defaults;
