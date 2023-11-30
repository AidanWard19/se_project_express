const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { PORT = 3001 } = process.env;

// const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "6567f96b891ef3784e64dde0", // paste the _id of the test user created in the previous step
  };
  next();
});
