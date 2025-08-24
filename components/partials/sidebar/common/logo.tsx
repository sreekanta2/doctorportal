import { SiteLogo } from "@/components/svg";
import { useSidebar } from "@/store";
import Link from "next/link";

const SidebarLogo = () => {
  const { collapsed } = useSidebar();
  return (
    <Link href="/" className="px-4 py-4 w-full flex  justify-center ">
      <div className="flex flex-1 items-center gap-x-3 z-[9999]  ">
        <SiteLogo className="text-primary h-8 w-8" />
        {!collapsed && (
          <div className="flex-1  text-xl text-primary  font-semibold">
            Care
          </div>
        )}
      </div>
    </Link>
  );
};

export default SidebarLogo;
