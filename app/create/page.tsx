"use client";
import { AppSidebar } from "@/components/app-sidebar";
import ExistingDrafts from "@/components/existing-drafts";
import ExistingTemplates from "@/components/existing-templates";
import SkeletonLoader from "@/components/skeleton-loader";
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
import { auth } from "@clerk/nextjs/server";
import { Authenticated, useConvexAuth } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
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
                  <BreadcrumbPage>Create PO</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserButton />
        </header>
        <section className="p-4 flex flex-col gap-5 mb-10 h-full">
          <Link
            className="md:w-1/4 w-full items-center rounded-lg justify-center border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-1/4 flex flex-col gap-5"
            href={"/create/new"}
          >
            <button className="flex flex-col items-center justify-center gap-5">
              <Plus size={35} />
              <span className="font-semibold text-xl">Create</span>
            </button>
          </Link>
          <section className="flex flex-col gap-5">
            <Suspense fallback={<SkeletonLoader />}>
              <Authenticated>
                <ExistingDrafts />
              </Authenticated>
            </Suspense>
          </section>

          <Suspense fallback={<SkeletonLoader />}>
            <Authenticated>
              <ExistingTemplates />
            </Authenticated>
          </Suspense>
          {/*  */}
          {/* <PoForm /> */}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
