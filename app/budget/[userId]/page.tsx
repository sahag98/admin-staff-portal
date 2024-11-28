import { Metadata } from "next";

import { Id } from "@/convex/_generated/dataModel";
import IndividualBudget from "@/components/individual-budget";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import PreloadedSidebar from "@/components/preloaded-sidebar";

export const metadata: Metadata = {
  title: "Individual Budget",
  description: "View and edit individual user budget",
};

export default async function BudgetPage({
  params,
  searchParams,
}: {
  params: { userId: Id<"users"> };
  searchParams: { admin: boolean };
}) {
  const preloadedUser = await preloadQuery(api.users.current);

  console.log(searchParams);
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
              {searchParams.admin === true && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/all-budgets">
                      All Budgets
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>Budget</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <IndividualBudget userId={params.userId} />
      </SidebarInset>
    </SidebarProvider>
  );
}
