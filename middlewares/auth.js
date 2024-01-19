const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err.name);
    next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;

  next();
};
