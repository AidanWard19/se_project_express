const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const app = express();
const { PORT = 3001 } = process.env;

// app.use((req, res, next) => {
//   req.user = {
//     _id: "6567f96b891ef3784e64dde0",
//   };
//   next();
// });

app.use(cors());
app.use(express.json());
app.post("/signin", login);
app.post("/signup", createUser);
app.use(routes);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
