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

const iconMap: Record<string, LucideIcon> = {
  Home,
  Calendar,
  Inbox,
  Search,
  Settings,
};

interface SidebarMenuItemProps {
  title: string;
  url: string;
  iconName: string;
}

export function SidebarMenuItemClient({
  title,
  url,
  iconName,
}: SidebarMenuItemProps) {
  const pathname = usePathname();

  const isActive = pathname === url || pathname.startsWith(`${url}/`);

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
