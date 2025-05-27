import { getBusinesses } from "@/app/actions";
import { AppSidebar } from "./app-sidebar";

export async function SidebarWrapper() {
  const businesses = await getBusinesses();
  return <AppSidebar businesses={businesses} />;
}
