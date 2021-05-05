const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  tickerSymbol: {
    type: String,
    uppercase: true,
    required: true,
  },
  avgPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
