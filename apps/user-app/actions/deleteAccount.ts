"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import db from "@repo/db/client";
import { serverUser } from "@/utils/currentUser";

export const deleteAccountAction = async (userId: string) => {
  const email1 = process.env.DEMO_EMAIL1 || "alice@example.com";
  const email2 = process.env.DEMO_EMAIL2 || "bob@example.com";

  try {
    const user = await serverUser();
    if (!user) {
      return { error: "You must be logged in!" };
    }

    if (user.id !== userId) {
      return { error: "Unauthorized!" };
    }

    if (user.email === email1 || user.email === email2) {
      return { error: "Demo accounts cannot be deleted!" };
    }

    await db.user.delete({
      where: { id: userId },
    });

    cookies().delete("authjs.csrf-token");
    cookies().delete("authjs.session-token");
    revalidatePath("/", "layout");

    return { success: "Account deleted successfully!" };
  } catch (err: any) {
    console.error("Error deleting account:", err);
    return {
      message: "Error deleting account!",
      error: err.message || "Unknown error occurred",
    };
  }
};
