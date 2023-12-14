const router = require("express").Router();
const {
  getUsers,
  getUserId,
  createUser,
  getCurrentUser,
  updateProfile,
  login,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

// router.post("/", createUser);
// router.get("/:userId", getUserId);
// router.get("/", getUsers);

module.exports = router;
