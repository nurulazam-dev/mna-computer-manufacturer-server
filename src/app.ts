import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());

app.use(cors({ origin: env.CLIENT_URL ? [env.CLIENT_URL] : true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) =>
  res.status(200).send("MNA Computer Manufacturer Server is Run"),
);

app.use("/", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
