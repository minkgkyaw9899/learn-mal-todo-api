import jwt from "jsonwebtoken";
import config from "../config";

export const signJwt = (id: number) => {
  return jwt.sign(
    {
      id,
    },
    config.jwtSecretKey
  );
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecretKey) as { id: number };
  } catch (error) {
    return null;
  }
};
