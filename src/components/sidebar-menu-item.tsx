"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SidebarItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  id: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function SidebarItem({
  title,
  url,
  icon: Icon,
  id,
  onDelete,
}: SidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const result = await onDelete(id);
      if (result.success) {
        toast.success("Business deleted successfully");
        if (pathname === url) {
          router.push("/");
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Failed to delete business");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={`py-2 ${pathname === url ? "bg-primary/10" : ""}`}
        asChild
      >
        <a className="py-2 h-15" href={url}>
          <Icon />
          <span>{title}</span>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            disabled={isDeleting}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
