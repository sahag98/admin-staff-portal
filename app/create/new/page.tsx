import { PoForm } from "@/components/po-form";
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
import { Id } from "@/convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";

export default async function Page({
  searchParams,
}: {
  searchParams: { draft_id: Id<"po_drafts">; template_id: Id<"pos"> };
}) {
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
                  {/* <BreadcrumbLink href="/create">Create PO</BreadcrumbLink>
                  <BreadcrumbSeparator /> */}
                  <BreadcrumbPage>New</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserButton />
        </header>
        <section className="flex justify-center mb-10 h-full">
          <PoForm
            draft_id={searchParams?.draft_id}
            template_id={searchParams?.template_id}
          />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
