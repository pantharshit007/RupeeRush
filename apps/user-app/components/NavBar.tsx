import { auth } from "@/lib/auth";
import LoginButton from "./auth/LoginButton";
import { Button } from "@repo/ui/components/ui/button";
import UserDropdown from "./common/UserDropdown";

async function NavBar() {
  // Get session data server-side
  const session = await auth();

  return (
    <div className="flex justify-between items-center border-b border-slate-300 px-4 h-[3.5rem] bg-[#f7f7fa]">
      <div className="text-2xl flex flex-col justify-center text-richPurple-600 font-bold italic">
        RupeeRush
      </div>
      <div className="flex flex-col justify-center">
        {!session?.user ? (
          // SignIn/Login
          <LoginButton asChild>
            <Button size="sm">Sign In</Button>
          </LoginButton>
        ) : (
          // User Profile
          <UserDropdown />
        )}
      </div>
    </div>
  );
}

export default NavBar;
