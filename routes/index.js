const express = require("express");
const tradeRoutes = require("./trade");
const portfolioRoutes = require("./portfolio");
const router = express.Router();

router.use("/trade",tradeRoutes);
router.use("/",portfolioRoutes);
module.exports = router;