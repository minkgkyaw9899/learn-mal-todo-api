import express from "express";
import config from "./config";
import userRouter from "./routes/user.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).json({
    message: "Up and Running",
  });
});

app.use("/api/users", userRouter);

app.listen(config.port, () => {
  console.log(`Server up and running at ${config.port}`);
});
