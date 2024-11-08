import { useSession } from "next-auth/react";

/**
 * fetch session data via `useSession`
 * @returns current user session data: `session.data.?user`
 */
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};
