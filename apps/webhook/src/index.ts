import express from "express";
import { router } from "./route";

const app = express();
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res: any) => {
  return res.json({
    msg: "Hello mom!!",
  });
});

app.listen(4000, () => {
  console.info("> Server started on port 4000");
});
