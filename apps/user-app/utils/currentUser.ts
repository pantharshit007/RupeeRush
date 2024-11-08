import { auth } from "@/lib/auth";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};
