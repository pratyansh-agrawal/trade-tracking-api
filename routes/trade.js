const controller = require('../controllers/TradeController');


const express = require("express");
const router = express.Router();

//Adding a trade
router.post("/", controller.addTrade);

//Updating a trade
router.put("/:id", controller.updateTrade);

//Removing a trade
router.delete("/:id", controller.removeTrade);
