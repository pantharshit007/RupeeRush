import { auth } from "@/lib/auth"; // Import your auth configuration
import { AuthButton } from "@/components/common/AuthButton";

async function NavBar() {
  // Get session data server-side
  const session = await auth();

  return (
    <div className="flex justify-between items-center border-b border-slate-300 px-4 h-[3.5rem] bg-[#f7f7fa]">
      <div className="text-2xl flex flex-col justify-center text-richPurple-600 font-bold italic">
        RupeeRush
      </div>
      <div className="flex flex-col justify-center">
        <AuthButton isAuthenticated={!!session?.user} />
      </div>
    </div>
  );
}

export default NavBar;
