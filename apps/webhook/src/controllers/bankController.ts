import { Request, Response } from "express";
import db from "@repo/db/client";

interface PaymentInfo {
  token: string;
  userId: string;
  amount: number;
}

async function hdfcWebHook(req: Request, res: Response) {
  //TODO: Add zod validation here?
  //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

  if (!req.body) {
    return res.status(401).json({
      success: false,
    });
  }

  const paymentInformation: PaymentInfo = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };

  try {
    await db.$transaction([
      // update balance db
      db.walletBalance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          balance: {
            // TODO: why type conversion?
            increment: paymentInformation.amount,
          },
          locked: {
            decrement: paymentInformation.amount,
          },
        },
      }),

      // update onRampTrans db
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "SUCCESS",
        },
      }),
    ]);

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
