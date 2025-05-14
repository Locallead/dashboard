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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getBusinesses } from "@/app/actions";
import { useEffect, useState } from "react";
import { Business } from "@/app/generated/prisma";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const businesses = await getBusinesses();
      setBusinesses(businesses);
    };
    fetchBusinesses();
  }, []);

  console.log("pathname", pathname);

  const items = businesses.map((business) => ({
    title: business.name,
    url: `/business/${business.id}`,
    icon: Home,
  }));

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarHeader className="bg-primary rounded my-2 text-white">
            <Link href="/" className="flex items-center gap-2">
              <Plus className="w-4 h-4 block" />
              <p className="block">Add a new business</p>
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`${
                      pathname === item.url ? "bg-primary/10" : ""
                    }`}
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
