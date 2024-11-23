import CollapsableMobile from "@/components/CollapsableMobile";
import NavBar from "@/components/NavBar";
import ThemeBackground from "@/components/common/ThemeBackground";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";

async function SideBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col mx-auto ">
      <NavBar />
      <ThemeBackground>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 h-full flex-col">
              <CollapsableMobile />
              <main className=" w-full max-lg:max-w-[1200px] max-w-maxContent ">{children}</main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeBackground>
    </div>
  );
}

export default SideBarLayout;
