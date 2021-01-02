const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "ultrasuperdupersecretkey";

const generateToken = (user) => {
  const { id, email, createdAt } = user;

  return jwt.sign(
    {
      id,
      email,
      createdAt,
    },
    SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

module.exports = { generateToken };
