//all actions for trade routed apis - post, put, delete

const Trade = require("../models/Trade");
const Portfolio = require("../models/Portfolio");

//adding a new trade
const createTrade = async (tickerSymbol, price, quantity, action) => {
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
const addPortfolioTicker = async (tickerSymbol, avgPrice, quantity) => {
      let newPortfolio = new Portfolio({
            tickerSymbol,
            avgPrice,
            quantity,
      });
      newPortfolio = await newPortfolio.save();
      return newPortfolio;
};

const buyAction = async (portfolio, price, quantity) => {
      portfolio.avgPrice = (((portfolio.avgPrice * portfolio.quantity) + (price * quantity)) / (portfolio.quantity + quantity)).toFixed(2);
      portfolio.quantity = portfolio.quantity + quantity;
      portfolio = await portfolio.save();
      return portfolio;
}

const sellAction = async (portfolio, quantity) => {
      portfolio.quantity = portfolio.quantity - quantity;
      portfolio = await portfolio.save();
      return portfolio;
}

const removePortfolioTrade = async (trade, portfolio) => {
      const tradePrice = trade.price;
      const tradeQty = trade.quantity;
      if (trade.action === "BUY") {
            portfolio.avgPrice = ((portfolio.avgPrice * portfolio.quantity - tradePrice * tradeQty) / (portfolio.quantity - tradeQty)).toFixed(2);
            portfolio.quantity = portfolio.quantity - tradeQty;
            portfolio = await portfolio.save();
      } else {
            portfolio.quantity = portfolio.quantity - tradeQty;
            portfolio = await portfolio.save();
      }

      return portfolio;
}

const addPortfolioTrade = async (trade, portfolio) => {
      if (trade.action === 'BUY') {
            portfolio = await buyAction(portfolio, trade.quantity, trade.price);
            return portfolio;
      }
      portfolio = await sellAction(portfolio, trade.quantity);
      return portfolio;
};

module.exports = {
      addTrade: async (req, res) => {
            const { tickerSymbol, quantity, price, action } = req.body;
            let portfolio = await Portfolio.findOne({ tickerSymbol });
            if (!portfolio) {
                  //create new portfolio with placeholder values
                  portfolio = await addPortfolioTicker(tickerSymbol, 0, 0);
            }
            if (portfolio) {
                  if (action === "BUY") {
                        //create new trade
                        const newTrade = await createTrade(tickerSymbol, price, quantity, action);

                        //update buyprice in portfolio
                        portfolio = await buyAction(portfolio, price, quantity);

                        return res.status(200).json(newTrade);
                  } else {
                        if (portfolio.quantity - quantity >= 0) {
                              const newTrade = await createTrade(tickerSymbol, price, quantity, action);

                              //update sellprice in portfolio
                              portfolio = await sellAction(portfolio, quantity);

                              return res.status(200).json(newTrade);
                        }
                        return res.status(403).json("Not enough shares");
                  }
            }
      },
      removeTrade: async (req, res) => {
            const tradeId = req.params.id;
            const trade = await Trade.findById(tradeId);
            if (!trade) {
                  return res.status(400).json("Invalid trade id");
            }
            let portfolio = await Portfolio.findOne({ tickerSymbol: trade.tickerSymbol });

            if (trade.action === "BUY" && trade.quantity - quantity < 0) {
                  return res.status(403).json("Insufficient shares to perform the action");
            }

            //update portfolio with removed trade
            portfolio = await removePortfolioTrade(trade, portfolio);

            //remove trade
            trade = await Trade.findByIdAndDelete(tradeId);
            return res.status(200).json(trade);

      },
      updateTrade: async (req, res) => {
            const tradeId = req.params.id;
            let trade = await Trade.findById(tradeId);
            if (!trade) {
                  return res.status(400).json("Invalid trade id");
            }
            //case when tickerSymbol or action is changed
            const { tickerSymbol, quantity, price, action } = req.body;
            if (trade.tickerSymbol !== tickerSymbol || (trade.tickerSymbol === tickerSymbol && trade.action !== action)) {
                  if (trade.action === "BUY" && trade.quantity - quantity < 0) {
                        return res.status(403).json("Insufficient shares to perform the action");
                  }
                  let portfolio = await Portfolio.findOne({ tickerSymbol: trade.tickerSymbol });

                  portfolio = await removePortfolioTrade(trade, portfolio);

                  portfolio = await Portfolio.findOne({ tickerSymbol });
                  if (!portfolio) {
                        portfolio = await addPortfolioTicker(tickerSymbol, 0, 0);
                  }
                  if (action === "BUY") {
                        portfolio = await buyAction(portfolio, price, quantity);
                        trade.tickerSymbol = tickerSymbol;
                        trade.quantity = quantity;
                        trade.price = price;
                        trade.action = action;
                        trade = await trade.save();
                        return res.status(200).json(trade);
                  }
                  if (portfolio.quantity - quantity >= 0) {
                        portfolio = await sellAction(portfolio, quantity);
                        trade.tickerSymbol = tickerSymbol;
                        trade.quantity = quantity;
                        trade.price = price;
                        trade.action = action;
                        trade = await trade.save();
                        return res.status(200).json(trade);
                  }
                  portfolio = await addPortfolioTrade(trade, portfolio);
                  return res.status(400).json('Not enough shares to update the trade');

            }

            //case when only quantity or price is changed
            const qtyChange = quantity - trade.quantity;
            if (qtyChange === 0 && trade.price === price) {
                  return res.status(400).json("No change in the trade details");
            }
            let portfolio = await Portfolio.findOne({ tickerSymbol: trade.tickerSymbol });
            if (action === "BUY") {
                  if (qtyChange < 0 && portfolio.quantity - qtyChange < 0) {
                        return res.status(403).json("This trade can no longer be changed");
                  }
                  portfolio.avgPrice = (portfolio.avgPrice * portfolio.quantity - trade.quantity * trade.price) / (portfolio.quantity - trade.quantity);
                  portfolio.avgPrice = ((portfolio.avgPrice * (portfolio.quantity - trade.quantity) + price * quantity) / (portfolio.quantity + qtyChange)).toFixed(2);
                  if (qtyChange === 0) {
                        portfolio = await portfolio.save();
                  } else if (qtyChange > 0) {
                        portfolio.quantity = portfolio.quantity + qtyChange;
                        portfolio = await portfolio.save();
                  } else {
                        portfolio.quantity = portfolio.quantity + Math.abs(qtyChange);
                        portfolio = await portfolio.save();
                  }
            } else {
                  if(qtyChange > 0 && portfolio.quantity - Math.abs(qtyChange) < 0) {
                        return res.status(403).json("This trade can no longer be changed");
                  }
                  else if(qtyChange > 0) {
                        portfolio.quantity = portfolio.quantity - qtyChange;
                        portfolio = await portfolio.save();
                  } else {
                        portfolio.quantity = portfolio.quantity + Math.abs(qtyChange);
                        portfolio = await portfolio.save();
                  }
            }
            trade.quantity = quantity;
            trade.price = price;
            trade = await trade.save();
            return res.status(200).json(trade);
      }
}