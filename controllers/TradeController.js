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
      portfolio.avgPrice = ((portfolio.avgPrice * portfolio.quantity) + (price * quantity))/(portfolio.quantity + quantity); 
      portfolio.quantity = portfolio.quantity + quantity;
      portfolio = await portfolio.save();
      return portfolio;
}

const sellAction = async (portfolio, quantity) => {
      portfolio.quantity = portfolio.quantity - quantity;
      portfolio = await portfolio.save();
      return portfolio;
}

const removePortfolioTrade = async(trade, portfolio) => {
      const tradePrice = trade.price;
      const tradeQty = trade.quantity;
      if(trade.action === "BUY") {
            portfolio.avgPrice = (portfolio.avgPrice * portfolio.quantity - tradePrice * tradeQty)/(portfolio.quantity - tradeQty);
            portfolio.quantity = portfolio.quantity - tradeQty;
            portfolio = await portfolio.save();
      } else {
            portfolio.quantity = portfolio.quantity - tradeQty;
            portfolio = await portfolio.save();
      }

      return portfolio;
}

module.exports = {
      addTrade: async(req, res) => {
            const {tickerSymbol, quantity, price, action} = req.body;
            let portfolio = await Portfolio.findOne({tickerSymbol});
            if(!portfolio){
                  //create new portfolio with placeholder values
                  portfolio = await addPortfolioTicker(tickerSymbol, 0, 0);
            }
            if(portfolio) {
                  if(action === "BUY") {
                        //create new trade
                        const newTrade = createTrade(tickerSymbol, price, quantity, action);

                        //update buyprice in portfolio
                        portfolio = buyAction(portfolio, price, quantity);

                        return res.status(200).body(newTrade);
                  } else {
                        if(portfolio.quantity - quantity >= 0){
                              const newTrade = createTrade(tickerSymbol, price, quantity, action);

                              //update sellprice in portfolio
                              portfolio = sellAction(portfolio, quantity);

                              return res.status(200).body(newTrade);
                        }
                        return res.status(403).body("Not enough shares");
                  }
            }
      },
      removeTrade: async(req,res) => {
            const tradeId = req.params.id;
            const trade = await Trade.findById(tradeId);
            if(!trade){
                  return res.status(400).body("Invalid trade id");
            }
            let portfolio = await Portfolio.findOne({tickerSymbol: trade.tickerSymbol});

            if(trade.action === "BUY" && trade.quantity - quantity < 0) {
                  return res.status(403).body("This trade can no longer be removed");
            }

            //update portfolio with removed trade
            portfolio = await removePortfolioTrade(trade, portfolio);
            
            //remove trade
            trade = await Trade.findByIdAndDelete(tradeId);
            return res.status(200).body(trade);

      },
      updateTrade: async(req,res) => {
            const {tickerSymbol, quantity, price, action} = req.body;

      }
}