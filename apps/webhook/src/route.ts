import { hdfcWebHook } from "./controllers/bankController.js";

import { Router } from "express";
const router = Router();

router.post("/hdfcWebHook", async (req, res) => {
  await hdfcWebHook(req, res);
});

export { router };
