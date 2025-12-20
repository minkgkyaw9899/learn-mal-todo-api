import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT ? +process.env.PORT : 4000,
  connectionString: process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : "postgresql://postgres:postgres@localhost:5432/todo",
  jwtSecretKey: "123",
};
