//all actions for trade routed apis - post, put, delete

import Trade from "../models/Trade";
import Portfolio from "../models/Portfolio";

//adding a new trade
const createTrade = (tickerSymbol, price, quantity, action) => {
      let newTrade = new Trade({
            tickerSymbol,
            price,
            quantity,
            action,
      });
      newTrade = await newTrade.save();
      return newTrade;
};

//creating portfolio
const createPortfolio = async (tickerSymbol, avgPrice, quantity) => {
      let newPortfolio = new Portfolio({
            tickerSymbol,
            avgPrice,
            quantity,
      });
      newPortfolio = await newPortfolio.save();
      return newPortfolio;
};

module.exports = {
      addTrade: 
}