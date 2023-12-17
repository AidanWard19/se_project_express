const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.post("/signin", login);
app.post("/signup", createUser);
app.use(routes);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
