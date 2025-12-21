import express, { type ErrorRequestHandler } from "express";
import config from "./config";
import userRouter from "./routes/user.routes";
import { errorResponseFormatter } from "./lib/response-formatter";
import { NotFound } from "http-errors";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).json({
    message: "Up and Running",
  });
});

app.use("/api/users", userRouter);

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
