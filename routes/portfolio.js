const express = require("express");
const portController = require("../controllers/PortfolioController");
const router = express.Router();

//Getting portfolio
router.get("/portfolio", portController.getPortfolio);

//Getting returns
router.get("/returns", portController.getReturns);

router.get("/holdings", portController.getHoldings);

module.exports = router;