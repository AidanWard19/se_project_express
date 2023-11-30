const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user_id })
    .then((item) => {
      console.log(item);
      res.staus(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        return res
          .status(400)
          .send({ message: "Invalid request error on createItem", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Error from createItem", err });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(500).send({ message: "Get Items Failed", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "updateItem failed", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on deleteItem`, err });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on deleteItem`, err });
      } else {
        return res.status(500).send({ message: "deleteItem failed", err });
      }
    });
};

const likeItem = (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on likeItem`, err });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on likeItem`, err });
      } else {
        return res.status(500).send({ message: "likeItem failed", err });
      }
    });
};

const dislikeItem = (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on dislikeItem`, err });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on dislikeItem`, err });
      } else {
        return res.status(500).send({ message: "dislikeItem failed", err });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};
