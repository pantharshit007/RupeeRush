import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (session.user) {
      return NextResponse.json({
        success: true,
        message: "You are logged in!",
        user: session.user,
      });
    }
  } catch (err) {
    return NextResponse.json({
        success: false,
        message: "You are not Logged in!",
      },
      { status: 403 });
  }
};
