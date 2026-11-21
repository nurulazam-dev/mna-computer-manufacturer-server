import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res
    .status(200)
    .json({ message: "MNA Computer Manufacturer Server is running" });
});

// Keep the legacy route paths unchanged for frontend compatibility.
app.use("/api/v2", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
