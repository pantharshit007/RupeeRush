import { Router } from "express";
const router = Router();

import { hdfcWebHook } from "./controllers/bankController.js";
import { p2pController } from "./controllers/p2pController.js";
import { b2bController } from "./controllers/b2bController.js";

router.post("/hdfcWebHook", async (req, res) => {
  await hdfcWebHook(req, res);
});

router.post("/p2pWebhook", async (req, res) => {
  await p2pController(req, res);
});

router.post("/b2bWebhook", async (req, res) => {
  await b2bController(req, res);
});

export { router };
