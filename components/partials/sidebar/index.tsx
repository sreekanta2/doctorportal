"use client";

import {
  adminConfig,
  clinicConfig,
  doctorConfig,
  MenuItemProps,
  patientConfig,
} from "@/config/menus";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Role } from "@/lib/utils";

import { useSession } from "next-auth/react";
import MobileSidebar from "./mobile-sidebar";
import PopoverSidebar from "./popover";

const Sidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const user = useSession();

  // Type-safe role extraction
  const userRole = user?.data?.user?.role;

  // // Handle loading state
  // if (!isLoaded) {
  //   return (
  //     <div className="flex items-center space-x-4 p-4">
  //       <Skeleton className="h-10 w-10 rounded-full" />
  //       <div className="space-y-2">
  //         <Skeleton className="h-4 w-[100px]" />
  //         <Skeleton className="h-4 w-[80px]" />
  //       </div>
  //     </div>
  //   );
  // }

  // Get appropriate menu config based on role
  const getMenuConfig = (): MenuItemProps[] => {
    switch (userRole) {
      case Role.ADMIN:
        return adminConfig;
      case Role.DOCTOR:
        return doctorConfig;
      case Role.CLINIC:
        return clinicConfig;
      case Role.PATIENT:
        return patientConfig;
      default:
        // Handle unauthenticated or unknown roles
        return [];
    }
  };

  const menus = getMenuConfig();

  // Return appropriate sidebar based on screen size
  return (
    <div>
      {!isDesktop ? (
        <MobileSidebar menus={menus} />
      ) : (
        <PopoverSidebar menus={menus} />
      )}
    </div>
  );
};

export default Sidebar;
