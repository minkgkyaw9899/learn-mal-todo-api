import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});

export default {
  port: process.env.PORT ? +process.env.PORT : 4000,
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/todo",
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? "123",
  redisPassword: process.env.REDIS_PASSWORD ?? "redis_pass",
  redisUrl: process.env.REDIS_URL ?? "redis_url",
  redisCacheTime: 5 * 60, // 5 min
};
