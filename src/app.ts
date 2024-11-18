import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import globalErrorHandler from "./app/errors/global.error";
import notFoundHandler from "./app/errors/not-found.error";
import router from "./app/routes";

const app: Application = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("short"));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Server is running healthy!" });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
