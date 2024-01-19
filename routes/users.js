const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateProfile);

// router.post("/", createUser);
// router.get("/:userId", getUserId);
// router.get("/", getUsers);

module.exports = router;
