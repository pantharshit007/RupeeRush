import NavBar from "@/components/NavBar";
import ThemeBackground from "@/components/common/ThemeBackground";
import Sidebar from "@/components/transaction/SideBar";

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="w-screen min-h-screen flex flex-col mx-auto ">
      <NavBar />
      <ThemeBackground>
        <Sidebar />
        <div className="flex-1">
          <div className="w-11/12 max-lg:max-w-[1100px] max-w-maxContent mx-auto">{children}</div>
        </div>
      </ThemeBackground>
    </div>
  );
}
