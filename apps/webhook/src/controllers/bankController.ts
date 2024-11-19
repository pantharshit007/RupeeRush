import { Request, Response } from "express";

async function hdfcWebHook(req: Request, res: Response) {
  //TODO: Add zod validation here?
  //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

  if (!req.body) {
    return res.status(401).json({
      success: false,
    });
  }

  try {
    return res.status(200).json({
      success: true,
      message: "Payment Captured",
    });
  } catch (err: any) {
    console.error("> Error while processing webhook:", err.message);
    return res.status(411).json({
      success: false,
      message: "Error while processing webhook:" + err.message,
    });
  }
}

export { hdfcWebHook };
