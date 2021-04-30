import { Schema, model } from "mongoose";

const portfolioSchema = new Schema({
      tickerSymbol: {
            type: String,
            uppercase: true,
            required: true
      },
      avgPrice: {
            type: Number,
            required: true
      },
      quantity: {
            type: Number,
            required: true,
            min: 0
      }
});

export default new model('Portfolio', portfolioSchema);