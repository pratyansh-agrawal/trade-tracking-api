const Trade = require("../models/Trade");
const Portfolio = require("../models/Portfolio");

module.exports = {
  getPortfolio: async (req, res) => {
    let securities = await Portfolio.find({ quantity: { $ne: 0 } }).select(
      "tickerSymbol -_id"
    );
    securities = securities.map((doc) => doc.tickerSymbol);
    const portfolio = await Promise.all(
      securities.map(async (tickerSymbol) => {
        const trades = await Trade.find({ tickerSymbol }).select(
          "-tickerSymbol"
        );
        return {
          [tickerSymbol]: {
            trades,
          },
        };
      })
    );
    return res.status(200).json(portfolio);
  },
  getHoldings: async (req, res) => {
    const holdings = await Portfolio.find({ quantity: { $ne: 0 } });
    return res.status(200).json(holdings);
  },
  getReturns: async (req, res) => {
    const securities = await Portfolio.find({ quantity: { $ne: 0 } });
    const returns = securities.reduce(
      (acc, doc) => acc + (100 - doc.avgPrice) * doc.quantity,
      0
    );
    return res.status(200).json({ returns });
  },
};
