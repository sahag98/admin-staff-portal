import { AppSidebar } from "@/components/app-sidebar";
import PreloadedSidebar from "@/components/preloaded-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserName from "@/components/user-name";
import PurchaseOrdersTable from "@/components/user-po-list";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";

export default async function Page({
  params,
}: {
  params: { user: Id<"users"> };
}) {
  const { user } = params;
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
                <BreadcrumbLink href="/all-pos">All POs</BreadcrumbLink>
                <BreadcrumbSeparator />
                <UserName userId={user} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-4">
          <PurchaseOrdersTable user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
