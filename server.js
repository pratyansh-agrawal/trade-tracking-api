const mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((_) => console.log("DB connection successful"))
  .catch((err) => console.log("DB connection unsuccessful", err));
  

app.listen(port, () => console.log(`Server up and running on port ${port}`));

