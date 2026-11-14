"use strict";

var fs = require("fs");
var path = require("path");

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    var parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function writeJsonArray(filePath, records) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
}

function appendJsonRecord(filePath, record) {
  var records = readJsonArray(filePath);
  records.push(record);
  writeJsonArray(filePath, records);
  return record;
}

module.exports = {
  readJsonArray: readJsonArray,
  writeJsonArray: writeJsonArray,
  appendJsonRecord: appendJsonRecord
};
