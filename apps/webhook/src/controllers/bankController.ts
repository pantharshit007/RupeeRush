import { Request, Response } from "express";
import db from "@repo/db/client";

interface PaymentInfo {
  token: string;
  userId: string;
  amount: string;
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
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            // TODO: why type conversion?
            increment: Number(paymentInformation.amount),
          },
          locked: Number(paymentInformation.amount),
        },
      }),

      // update onRampTrans db
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
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
