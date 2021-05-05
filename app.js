const express = require("express");

const routes = require("./routes");

const app = express();

app.use(express.json());

app.get('/', (req,res) => res.send("Welcome to trading API"));

app.use('/api',routes);

module.exports = app;