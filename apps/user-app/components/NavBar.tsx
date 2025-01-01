import Link from "next/link";
import Image from "next/image";

import { Button } from "@repo/ui/components/ui/button";

import { auth } from "@/lib/auth";
import LoginButton from "@/components/auth/LoginButton";
import UserDropdown from "@/components/common/UserDropdown";
import ThemeModal from "@/components/ThemeModal";
import { ThemeBackgroundNavbar } from "@/components/common/ThemeBackground";
import StatusIndicator from "@/components/common/StatusIndicator";
import Logo from "public/logo1.jpg";

async function NavBar() {
  // Get session data server-side
  const session = await auth();

  return (
    <ThemeBackgroundNavbar>
      <div className="w-11/12 max-w-maxContent flex items-center justify-between">
        <Link href="/">
          <div className="text-2xl flex items-center justify-center gap-x-2">
            <Image
              src={Logo}
              alt="RupeeRush Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="hidden bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-2xl font-bold italic tracking-tight text-transparent min-[410px]:block">
              Rupee₹ush
            </p>
          </div>
        </Link>
        <div className="flex gap-x-4 justify-center items-center">
          <StatusIndicator />

          <ThemeModal />
          {!session?.user ? (
            <>
              {/* Login */}
              <LoginButton asChild mode="modal">
                <Button size="sm" variant={"ghost"} className="border-[1px]">
                  Login
                </Button>
              </LoginButton>

              {/* Signup */}
              <LoginButton asChild mode="signup">
                <Button size="sm" variant={"marketing"}>
                  Get started
                </Button>
              </LoginButton>
            </>
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
