import express from "express";
import cors from "cors";
import { dbCon } from "./src/config/index.js";
import dotenv from "dotenv";
import i18n from "./i18.js";
import { postRouter, triggerRouter } from "./src/routes/index.js";

dotenv.config();
dbCon();

const app = express();
app.use(i18n.init);

app.use(express.json());
app.use(cors());
app.use("/api/post", postRouter);
app.use("/api/trigger", triggerRouter);
app.listen(3000, () => {
  console.log("server is running at 3000");
});
