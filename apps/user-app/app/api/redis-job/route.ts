import { cache, cacheType } from "@repo/db/cache";
import { NextResponse } from "next/server";

const redisApiKey = process.env.REDIS_JOB_API_KEY;
export async function GET(req: Request) {
  const jobApiKey = req.headers.get("RedisJob-Api-Key") || "";

  if (jobApiKey !== redisApiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Job Key",
      },
      { status: 403 }
    );
  }

  const currentDate = new Date().toISOString();
  const res = await cache.set(cacheType.REDIS_CYCLE, [], { date: currentDate }, 60 * 60); // 1 hour
  console.log(res);

  return NextResponse.json({
    success: true,
    message: "Success, cycle re-started",
  });
}
