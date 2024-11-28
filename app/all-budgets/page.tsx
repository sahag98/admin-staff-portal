import AllUsers from "@/components/all-users";

import PreloadedSidebar from "@/components/preloaded-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function Page() {
  const preloadedUsers = await preloadQuery(api.users.getAllUsers);
  const preloadedUser = await preloadQuery(api.users.current);
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <PreloadedSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>All Budgets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <AllUsers
          preloadedUser={preloadedUser}
          preloadedUsers={preloadedUsers}
          admin={true}
          budget={true}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
