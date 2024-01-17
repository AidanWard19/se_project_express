const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
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
        next(new BadRequestError());
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  console.log(itemId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        throw new UnauthorizedError();
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.send({ message: `Item ${itemId} deleted` });
      });
    })
    .catch((err) => {
      if (err.message === "Not authorized to delete item") {
        next(new ForbiddenError());
      }
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError());
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
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
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError());
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError());
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
