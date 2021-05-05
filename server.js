const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const server = express();

const port = process.env.PORT || 5000;

server.use(
  bodyParser.urlencoded({
    extended: false
  })
);
server.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((_) => console.log("DB connection successful"))
  .catch((err) => console.log("DB connection unsuccessful", err));

server.listen(port, () => console.log(`Server up and running on port ${port}`));
server.use('/api',routes);