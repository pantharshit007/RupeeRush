import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CollapsableMobile from "@/components/CollapsableMobile";
import NavBar from "@/components/NavBar";
import ThemeBackground from "@/components/common/ThemeBackground";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { serverUser } from "@/utils/currentUser";
import { CREATE_BANK_ACCOUNT } from "@/utils/apiRoute";

async function SideBarLayout({ children }: { children: React.ReactNode }) {
  const user = await serverUser();

  if (!user?.phoneNumber) {
    redirect(CREATE_BANK_ACCOUNT);
  }

  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <div className="w-full h-screen flex flex-col mx-auto ">
      <NavBar />
      <ThemeBackground>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 h-full overflow-y-hidden flex-col">
              <CollapsableMobile />
              <main className=" w-full max-lg:max-w-[1200px]  ">{children}</main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeBackground>
    </div>
  );
}

export default SideBarLayout;
