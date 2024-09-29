import { hdfcWebHook } from "./controllers/bankController";

const express = require("express");
const router = express.Router();

router.post("/hdfcWebHook", hdfcWebHook);

export { router };
