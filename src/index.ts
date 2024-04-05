import "reflect-metadata";
import express from "express";
import "dotenv/config";

import "./database/connect";
import { KEYS } from "./constants/index";
import cors from "cors";
import routes from "./routes/index";
import essayRouter from "./routes/essay";
import userRouter from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);
app.use(essayRouter);
app.use(userRouter);

app.listen(KEYS.PORT, () =>
  console.log(`server started at https://localhost:${KEYS.PORT}`)
);
