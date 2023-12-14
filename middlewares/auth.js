const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  DEFAULT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err.name);
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  req.user = payload;

  next();
};
