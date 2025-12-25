import express, { type ErrorRequestHandler } from "express";
import config from "./config";
import userRouter from "./routes/user.routes";
import {
  errorResponseFormatter,
  successResponseFormatter,
} from "./lib/response-formatter";
import { NotFound } from "http-errors";
import authRouter from "./routes/auth.routes";
import { authenticateToken } from "./middlewares/authenticate-token";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import todoRouter from "./routes/todo.routes";
import RedisStore, { type RedisReply } from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import { redisClient } from "./lib/redis";

const app = express();

const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<RedisReply>,
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again after 15 minutes",
});

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(apiLimiter);
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).json(
    successResponseFormatter({
      message: "Up and Running",
    })
  );
});

app.use("/api/auth", authRouter);
app.use("/api/todo", authenticateToken, todoRouter);
app.use("/api/users", authenticateToken, userRouter);

app.use((_req, _res, next) => {
  return next(NotFound("Your requested route not found"));
});

app.use(((err, _req, res, _next) => {
  const message = err.message ?? "Internal Server Error";
  const status = err.status || 500;

  res.status(status).json(errorResponseFormatter(status, message));
  // return next
}) as ErrorRequestHandler);
app.listen(config.port, () => {
  console.log(`Server up and running at ${config.port}`);
});
