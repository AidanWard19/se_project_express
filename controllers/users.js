const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    res;
    throw new BadRequestError();
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequestError();
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.send({ name, avatar, email }))
    .catch((err) => {
      console.log(err.message);
      if (err.message === "User with email already exists") {
        next(new ConflictError());
      } else if (err.name === `ValidationError`) {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
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
        next(new BadRequestError());
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
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
        next(new UnauthorizedError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
