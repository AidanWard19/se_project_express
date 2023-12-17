const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request error on createItem" });
      }
      return res.status(DEFAULT).send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.log(err.name);
      res.status(DEFAULT).send({ message: "Get Items Failed" });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.send({ data: item }))
//     .catch((err) => {
//       res.status(DEFAULT).send({ message: "updateItem failed" });
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  console.log(itemId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Not authorized to delete item" });
        return Promise.reject(new Error("Not authorized to delete item"));
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.send({ message: `Item ${itemId} deleted` });
      });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.message === "Not authorized to delete item") {
        return res
          .status(FORBIDDEN)
          .send({ message: "Not authorized to delete item" });
      }
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on deleteItem` });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on deleteItem` });
      }
      return res.status(DEFAULT).send({ message: "deleteItem failed" });
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
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on likeItem` });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on likeItem` });
      }
      return res.status(DEFAULT).send({ message: "likeItem failed" });
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
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `DocumentNotFoundError`) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${err.name} error on dislikeItem` });
      }
      if (err.name === `CastError`) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${err.name} error on dislikeItem` });
      }
      return res.status(DEFAULT).send({ message: "dislikeItem failed" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
