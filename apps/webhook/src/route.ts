import { hdfcWebHook } from "./controllers/bankController.js";

const express = require("express");
const router = express.Router();

router.post("/hdfcWebHook", hdfcWebHook);

export { router };
