const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
      tickerSymbol: {
            type: String,
            required: true,
            uppercase: true
      },
      price: {
            type: Number,
            required: true,
            default: 100
      },
      quantity: {
            type: Number,
            required: true,
            min: 1
      },
      action: {
            type: String,
            enum: ["BUY","SELL"],
            required: true,
            uppercase: true
      }
});

module.exports = mongoose.model('Trade',tradeSchema);