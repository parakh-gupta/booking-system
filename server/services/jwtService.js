const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

exports.createToken = (username) => {
  return jwt.sign(
    {
      username,
    },
    jwt_secret,
    { expiresIn: "7 days" }
  );
};

exports.validateToken = (token) => {
  try {
    return jwt.verify(token, jwt_secret);
  } catch (err) {
    throw err;
  }
};
