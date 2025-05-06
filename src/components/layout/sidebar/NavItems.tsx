import React from "react";
import NavItem from "./NavItem";
import {
  Brain,
  FileText,
  Bell,
  ClipboardList,
} from 'lucide-react';
import { cn } from "@/lib/utils";

type NavItemsProps = {
  collapsed: boolean;
};

const NavItems = ({ collapsed }: NavItemsProps) => {
  return (
    <nav className="px-2 space-y-3">
      <NavItem
        to="/chat"
        icon={Brain}
        label="Ask Leny"
      />
      <NavItem
        to="/my-templates"
        icon={FileText}
        label="Smart Notes"
      />
      <NavItem
        to="/tumor-board"
        icon={ClipboardList}
        label="Expert Panel"
      />
      <NavItem
        to="/notifications"
        icon={Bell}
        label="Notifications"
      />
    </nav>
  );
};

export default NavItems;
