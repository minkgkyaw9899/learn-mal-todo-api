import Redis from "ioredis";
import config from "../config";

const redis = new Redis({ password: config.redisPassword });

export const setCache = async <T>(key: string, value: T) => {
  return await redis.setex(
    key,
    config.redisCacheTime,
    JSON.stringify(value, null, 2)
  );
};

export const getCache = async (key: string) => {
  return await redis.get(key);
};

export const removeCache = async (key: string) => {
  return await redis.del(key);
};
