
var mongoose = require("mongoose");

var schema = new mongoose.Schema({
  cost: { type: Number, required: true },
  income: { type: Number, required: true },
  profit: { type: Number, required: true },
  date: { type: Date, required: true },

  userid: { type: String, required: true },
});

module.exports = mongoose.model("Account", schema);