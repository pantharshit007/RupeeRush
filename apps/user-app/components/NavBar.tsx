import { auth } from "@/lib/auth";
import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@repo/ui/components/ui/button";
import UserDropdown from "@/components/common/UserDropdown";
import ThemeModal from "@/components/ThemeModal";
import { ThemeBackgroundNavbar } from "@/components/common/ThemeBackground";

async function NavBar() {
  // Get session data server-side
  const session = await auth();

  return (
    <ThemeBackgroundNavbar>
      <div className="w-11/12 max-w-maxContent flex items-center justify-between">
        <div className="text-2xl flex flex-col justify-center text-azureBlue-500 font-bold italic">
          RupeeRush
        </div>
        <div className="flex gap-x-2 justify-center">
          <ThemeModal />
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
    </ThemeBackgroundNavbar>
  );
}

export default NavBar;
