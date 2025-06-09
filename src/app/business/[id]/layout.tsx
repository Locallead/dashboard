import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Toaster />
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-hidden">
          <SidebarWrapper />
          <div className="flex-1 flex flex-col w-full">
            <header className="h-14 border-b px-4 flex items-center">
              <h1 className="text-lg font-medium">Site Builder</h1>
            </header>
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
