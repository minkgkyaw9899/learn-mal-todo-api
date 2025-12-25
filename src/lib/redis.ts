import Redis from "ioredis";
import config from "../config";

export const redisClient = new Redis(config.redisUrl);

export const setCache = async <T>(key: string, value: T) => {
  return await redisClient.setex(
    key,
    config.redisCacheTime,
    JSON.stringify(value, null, 2)
  );
};

export const getCache = async (key: string) => {
  return await redisClient.get(key);
};

export const removeCache = async (key: string) => {
  return await redisClient.del(key);
};
