var mongoose = require("mongoose");

var schema = new mongoose.Schema({
  income: { type: Number, required: true },
  expenses: { type: Number, required: true },
  budget: { type: Number, required: true },
  profit: { type: Number, required: true },
  vision: { type: String, required: true },
  userid: { type: String, required: true },
});

module.exports = mongoose.model("Board", schema);
