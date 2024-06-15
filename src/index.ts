import "reflect-metadata";
import express from "express";
import "dotenv/config";

import "./database/connect";
import { KEYS } from "./constants/index";
import cors from "cors";
import healthCheck from "./routes/healthCheck";
import userRouter from "./routes/user/user";
import userPermissionRouter from "./routes/user/permission";
import essayRouter from "./routes/essay/essay";

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthCheck);
app.use(userPermissionRouter);
app.use(userRouter);
app.use(essayRouter);

app.listen(KEYS.PORT, () =>
  console.log(`server started at https://localhost:${KEYS.PORT}`)
);
