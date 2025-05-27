"use client";

import { Calendar, Home, Inbox, Plus, Search, Settings } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { deleteBusiness } from "@/app/actions";
import { Business } from "@/app/generated/prisma";
import { SidebarItem } from "./sidebar-menu-item";

interface AppSidebarProps {
  businesses: Business[];
}

export function AppSidebar({ businesses }: AppSidebarProps) {
  const items = businesses.map((business) => ({
    title: business.name,
    url: `/business/${business.id}`,
    icon: Home,
    id: business.id,
  }));

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarHeader className="bg-primary rounded-md my-2 py-2 text-white">
            <Link href="/" className="flex items-center gap-2">
              <Plus className="w-4 h-4 block" />
              <p className="block text-sm">Add a new business</p>
            </Link>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {!items.length && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <span>No Businesses</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {items.map((item) => (
                <SidebarItem
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                  id={item.id}
                  onDelete={deleteBusiness}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
