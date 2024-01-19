const router = require("express").Router();
const clothingItem = require("./clothingItems");
const users = require("./users");
const { NotFoundError } = require("../utils/NotFoundError");
const auth = require("../middlewares/auth");

router.use("/items", clothingItem);
router.use("/users", auth, users);

router.use((req, res, next) => {
  next(new NotFoundError("Resource not found"));
});

module.exports = router;
