import PoliciesList from "@/components/policies-list";
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
import UploadFiles from "@/components/upload-files";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { preloadQuery } from "convex/nextjs";

export default async function Page() {
  const preloadedPolicies = await preloadQuery(api.resource.getPolicies);
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
        <header className="flex h-16 w-full justify-between shrink-0 items-center gap-2 px-4">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Policies</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserButton />
        </header>
        <div className="p-4 space-y-5">
          <UploadFiles type="policy" />
          <PoliciesList preloadedPolicies={preloadedPolicies} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
