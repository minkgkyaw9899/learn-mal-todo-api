import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT ? +process.env.PORT : 4000,
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/todo",
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? "123",
  redisPassword: process.env.REDIS_PASSWORD ?? "redis_pass",
  redisCacheTime: 5 * 60, // 5 min
};
