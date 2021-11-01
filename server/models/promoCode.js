const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromoCodeSchema = new Schema({
  code: {type: String, index: true, unique: true, required: true},
  discount: { type: Number, required: true },
  limitedBy: String,
  stock: Number,
  expiration: Date,
});

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
