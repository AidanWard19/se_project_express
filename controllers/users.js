const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  DEFAULT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      res.status(DEFAULT).send({ message: `${err.name} from getUsers` });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((foundUser) => {
      res.status(200).send({ data: foundUser });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on getUserId` });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on getUserId` });
      }
      return res
        .status(DEFAULT)
        .send({ message: `${err.name} error from getUserId` });
    });
};

const createUser = (req, res) => {
  console.log("testing", req.body);
  const { name, avatar, email, password } = req.body;
  if (!email) {
    return res
      .status(400)
      .send({ message: "Cannot create user with no email" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error("User with email already exists"));
        // return res.status(409).send({ message: "User already exists" });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(({ name, avatar, email }) => {
      return res.status(200).send({ name, avatar, email });
    })
    .catch((err) => {
      console.log(err.message);
      if (err.message === "User with email already exists") {
        return res.status(409).send({ message: "User already exists" });
      }
      if (err.name === `ValidationError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request error on createUser" });
      }
      return res.status(DEFAULT).send({ message: "Error from createUser" });
    });
};
// } else {

//   return res
//     .status(404)
//     .send({ message: "User with same email already exists" });
// }

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err.name);
      res
        .status(NOT_FOUND)
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
      .status(400)
      .send({ message: "Email and or password field is empty" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: `${err.message}` });
      }
      return res.status(400).send({ message: `${err.name} error on login` });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
