import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import axios from "axios";

export async function GET(req: Request) {
  const URL =
    "https://backend.lambdatest.com/api/dev-tools/credit-card-generator?type=American%20Express&no-of-cards=1";

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "user-agent": req.headers.get("user-agent"),
  };

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not logged in!",
        },
        { status: 403 }
      );
    }

    const response = await axios.get(URL, { headers });

    // Update the number of the card: len:15 -> len:16
    const originalNumber = response.data[0].number;
    const randomDigit = Math.floor(Math.random() * 9) + 1;
    const updatedNumber = originalNumber + randomDigit.toString();

    response.data[0].number = updatedNumber;

    return NextResponse.json({
      success: true,
      message: "Success CC generated",
      data: response.data,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred!",
      },
      { status: 500 }
    );
  }
}
