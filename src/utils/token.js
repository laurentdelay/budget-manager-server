const { AuthenticationError } = require("apollo-server-errors");
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

const checkAuth = (context) => {
  // récupération du header d'authorisation
  const authHeader = context.headers.authorization;

  if (authHeader) {
    // récupération du token
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/ Expired token");
      }
    }
    throw new AuthenticationError(
      'Authorization header must be "Bearer <token>"'
    );
  }
  throw new AuthenticationError("Authorization header must be provided");
};

module.exports = { generateToken, checkAuth };
