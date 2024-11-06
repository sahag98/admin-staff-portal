import { AppSidebar } from "@/components/app-sidebar";
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
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Construction } from "lucide-react";

export default async function Page() {
  const user = await currentUser();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 w-full justify-between shrink-0 items-center gap-2 px-4">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserButton />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h2 className="font-semibold text-xl"> Hey {user?.firstName}</h2>
          <p className="font-semibold">
            Welcome to our new platform for purchase orders, budgets and more!
          </p>
          <p>
            Go ahead and click through each sidebar tab to get familiar with all
            its functionalities.
          </p>
          <div className="flex bg-secondary rounded justify-center items-center flex-col gap-2 flex-1">
            <Construction size={50} />

            <h2>This page is not finished yet.</h2>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
