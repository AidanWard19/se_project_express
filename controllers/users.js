const user = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      res.status(DEFAULT).send({ message: `${err.name} from getUsers` });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;

  user
    .findById(userId)
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
  const { name, avatar } = req.body;

  user
    .create({ name, avatar })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request error on createUser" });
      }
      return res.status(DEFAULT).send({ message: "Error from createUser" });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
};
