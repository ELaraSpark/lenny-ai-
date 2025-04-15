
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import NavItems from "./NavItems";
import UserProfile from "./UserProfile";
import { SidebarLiveCallIndicator } from "@/components/followup/components/SidebarLiveCallIndicator";

type SidebarContainerProps = {
  className?: string;
};

const SidebarContainer = ({ className }: SidebarContainerProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[250px]",
        className
      )}
    >
      <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div className="flex-1 overflow-y-auto py-4">
        <NavItems collapsed={collapsed} />
      </div>

      <div className={collapsed ? "hidden" : "block"}>
        <SidebarLiveCallIndicator />
      </div>

      <UserProfile collapsed={collapsed} />
    </div>
  );
};

export default SidebarContainer;
