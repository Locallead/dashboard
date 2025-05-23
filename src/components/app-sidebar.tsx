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
import { getBusinesses, deleteBusiness } from "@/app/actions";
import { useEffect, useState } from "react";
import { Business } from "@/app/generated/prisma";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AppSidebar() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const fetchBusinesses = async () => {
      const businesses = await getBusinesses();
      setBusinesses(businesses);
    };
    fetchBusinesses();
  }, []);

  const items = businesses.map((business) => ({
    title: business.name,
    url: `/business/${business.id}`,
    icon: Home,
    id: business.id,
  }));

  const handleDelete = async (id: string) => {
    const result = await deleteBusiness(id);
    if (result.success) {
      toast.success("Business deleted successfully");
      router.push("/");
    } else {
      toast.error("Failed to delete business");
    }
  };

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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`${
                      pathname === item.url ? "bg-primary/10" : ""
                    }`}
                    asChild
                  >
                    <a className="py-2" href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
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
