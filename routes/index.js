const route = require("express");
const tradeRoutes = require("./trade");
const portfolioRoutes = require("./portfolio");
const router = route.Router();
router.get('/ready', (req, res) => res.send('API is up and running!'));
router.use("/trade",tradeRoutes);
router.use("/",portfolioRoutes);