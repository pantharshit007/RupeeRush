import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      return NextResponse.json({
        success: true,
        message: "You are logged in!",
        user: session.user,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "You are not logged in!",
      },
      { status: 403 }
    );
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
