const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockHeader = new Schema({
  version: {
    type: Number,
    required: true,
  },
  prevBlockHash: {
    type: String,
    required: true,
  },
  merkleroot: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  bits: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
  blockhash: {
    type: String,
    required: true,
  },
});

const blockSchema = new Schema({
  Height: {
    type: Number,
    required: true,
  },
  BlockSize: {
    type: Number,
    require: true,
  },
  blockHeader: blockHeader,
  TxCount: {
    type: Number,
    required: true,
  },
  Transactions: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.models.blockSchema || mongoose.model("blockSchema", blockSchema);
