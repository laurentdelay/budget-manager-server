import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { Context } from "vm";

import { ITokenUser, IUser } from "../interfaces/user.interface";

const SECRET_KEY: string = process.env.SECRET_KEY ?? "ultrasuperdupersecretkey";

export const generateToken = (user: IUser): string => {
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

export const checkAuth = (context: Context): ITokenUser => {
  // récupération du header d'authorisation
  const authHeader: string = context.headers.authorization;

  if (authHeader !== undefined) {
    // récupération du token
    const token: string = authHeader.split("Bearer ")[1];

    if (token !== undefined) {
      try {
        const user: ITokenUser = jwt.verify(token, SECRET_KEY) as ITokenUser;
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new AuthenticationError(
      'Authorization header must be "Bearer <token>"'
    );
  }
  throw new AuthenticationError("Authorization header must be provided");
};
