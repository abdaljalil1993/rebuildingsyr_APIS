import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
