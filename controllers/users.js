const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    res
      .status(BAD_REQUEST)
      .send({ message: "Cannot create user with no email" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error("User with email already exists"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.send({ name, avatar, email }))
    .catch((err) => {
      console.log(err.message);
      if (err.message === "User with email already exists") {
        res.status(CONFLICT).send({ message: "User already exists" });
      }
      if (err.name === `ValidationError`) {
        res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request error on createUser" });
      }
      res.status(DEFAULT).send({ message: "Error from createUser" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on getCurrentUser` });
      }
      res
        .status(DEFAULT)
        .send({ message: `${err.name} error on getCurrentUser` });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      console.error(err.name);

      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on getCurrentUser` });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on getCurrentUser` });
      }

      res
        .status(DEFAULT)
        .send({ message: `${err.name} error on updateProfile` });
    });
};

const login = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and or password field is empty" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: `${err.message}` });
      }
      return res
        .status(BAD_REQUEST)
        .send({ message: `${err.name} error on login` });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
