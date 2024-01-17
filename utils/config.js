module.exports = {
  JWT_SECRET = NODE_ENV === "production" ? process.env.JWT_SECRET : "secret-key";
};
