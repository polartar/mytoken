const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenizerSchema = new Schema({
  createdOn: Date,
  firstName: String,
  lastName: String,
  ownerCompany: String,
  email: String,
  companyPhone: String,
  website: String,
  symbol: String,
  title: String,
  supply: Number,
  assetInfo: String,
  assetType: String,
  otherOptionSelect: Boolean,
  otherAsset: String,
  assetId: String,
  divisible: String,
  hodlersLimit: String,
  limitNumber: String,
  ownerETHAddress: String,
  tokenDisplay: String,
  whitelist: Boolean,
  allAccredited: Boolean,
  invalid: Boolean,
  comments: String,
  checkoutDetails: {
    coin: String,
    address: String,
    amount: String,
    checkout_url: String,
    confirms_needed: String,
    qrcode_url: String,
    status_url: String,
    timeout: Number,
    txn_id: {type: String, index: true, unique: true, required: true},
    promoCode: String,
  },
  paymentDetails: {
    amount1: String,
    amount2: String,
    buyer_name: String,
    currency1: String,
    currency2: String,
    email: String,
    fee: String,
    ipn_id: String,
    ipn_mode: String,
    ipn_type: String,
    ipn_version: String,
    merchant: String,
    received_amount: String,
    received_confirms: String,
    status: Number,
    status_text: String,
    txn_id: String,
    confirmationSent: { type: Boolean, default: false },
  },
  paymentHistory: { type: [ Schema.Types.Mixed ], default: [] },
  status: {type: String, default: 'WAITING_PAYMENT'},
  transactionHash: String,
  ipfsHash: String,
  contractAddress: String,
  receipt: Schema.Types.Mixed,
  promoCode: String,
  emailSent: {
    payment: Boolean,
    paymentConfirmation: Boolean,
    confirmation: Boolean,
  },
});

TokenizerSchema.pre('save', function(next) {
  if (!this.createdOn) {
    this.createdOn = new Date();
  }
  if (this.paymentDetails) {
    this.paymentDetails.status = Number(this.paymentDetails.status);
  }
  next();
});

module.exports = mongoose.model('Tokenizer', TokenizerSchema);
