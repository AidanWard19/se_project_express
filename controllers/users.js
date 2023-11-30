const user = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      res.status(DEFAULT).send({ message: `${err.name} from getUsers`, err });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;

  user
    .findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on getUserId`, err });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on getUserId`, err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: `${err.name} error from getUserId`, err });
      }
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
          .send({ message: "Invalid request error on createUser", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Error from createUser", err });
      }
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
};
