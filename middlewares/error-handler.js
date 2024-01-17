module.exports.errorHandler = (err, req, res, next) => {
  if (!err) {
    return res
      .status(err.status)
      .send({ name: err.name, message: err.message });
  } else {
    return res.status(500).send({ name: err.name, message: err.message });
  }
};
