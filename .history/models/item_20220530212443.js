var mongoose= require('mongoose');

var schema = new mongoose.Schema({
  cost: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  condition: { type: String, required: true },

  userid: { type: String, required: true },
});

module.exports = mongoose.model('Item',schema)