import express from "express";
import cors from "cors";
import "dotenv/config";

import { router } from "./route.js";

const FRONTEND_URL = process.env.FE_URL || "http://localhost:3000";

const allowedOrigins = FRONTEND_URL.split(",").map((origin) => origin.trim()); // allow multiple origins

const app = express();
app.use(
  express.json({
    verify: (req, res, buf) => {
      // @ts-ignore
      req.rawBody = buf;
    },
  })
);
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the list of allowed origins
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", (req, res: any) => {
  return res.json({
    msg: "Hello mom!!",
  });
});

app.get("/ping", (req, res: any) => {
  return res.json({
    msg: "pong",
  });
});

app.listen(4000, () => {
  console.info("> Server started on port 4000");
});

export default app;
