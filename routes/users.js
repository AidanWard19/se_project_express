// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user

const router = require("express").Router();
const { getUsers, getUserId, createUser } = require("../controllers/users");

router.post("/", createUser);

router.get("/:userId", getUserId);

router.get("/", getUsers);

module.exports = router;
