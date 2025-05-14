"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Inbox,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// Map of icon names to icon components
const iconMap: Record<string, LucideIcon> = {
  Home,
  Calendar,
  Inbox,
  Search,
  Settings,
  // Add any other icons you need
};

interface SidebarMenuItemProps {
  title: string;
  url: string;
  iconName: string; // Now we pass the icon name as a string
}

export function SidebarMenuItemClient({
  title,
  url,
  iconName,
}: SidebarMenuItemProps) {
  const pathname = usePathname();

  // Check if the current path matches the item's URL
  const isActive = pathname === url || pathname.startsWith(`${url}/`);

  // Get the icon component from the map, or default to Home
  const Icon = iconMap[iconName] || Home;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <a
          href={url}
          className={isActive ? "pointer-events-none" : ""}
          aria-current={isActive ? "page" : undefined}
        >
          <Icon />
          <span>{title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
