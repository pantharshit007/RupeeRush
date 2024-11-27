import express from "express";
// import { router } from "./route";
import { router } from "./route.js";

const app = express();
app.use(express.json());
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
