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
