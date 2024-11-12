import { auth } from "@/lib/auth";

export const serverUser = async () => {
  const session = await auth();
  return session?.user;
};
