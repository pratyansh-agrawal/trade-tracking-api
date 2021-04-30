const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((_) => console.log("DB connection successful"))
  .catch((_) => console.log("DB connection unsuccessful"));

app.listen(port, () => console.log(`Server up and running on port ${port}`));
