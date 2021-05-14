const Trade = require("../models/Trade");
const Portfolio = require("../models/Portfolio");
const axios = require("axios");

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
    const tickerSymbols = securities.reduce(
      (acc, curr) => acc + curr.tickerSymbol + ",",""
    );
    const currTradeValues = await getTradeValues(tickerSymbols);
    const currTradeData = currTradeValues.data;

    let currTradeObj = {};
    for(ticker in currTradeData) {
      currTradeObj = {
        ...currTradeObj,
        [currTradeData[ticker].sid]:currTradeData[ticker].price
      }
    }
    const returns = securities.reduce(
      (acc, doc) => 
        acc + ((currTradeObj[doc.tickerSymbol] ? currTradeObj[doc.tickerSymbol] : 100)  - doc.avgPrice) * doc.quantity
      ,
      0
    );

    return res.status(200).json({ returns });
  },
};

const getTradeValues = async (tickerSymbols) => {
  const apiUrl = "https://quotes-api.tickertape.in/quotes?sids="+tickerSymbols.split(0,tickerSymbols.length-1);
  return await axios.get(apiUrl)
  .then((res) => {
    return res.data;
  })
  .catch((err) => {
    console.log(err);
  });
}
