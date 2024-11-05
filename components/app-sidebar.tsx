"use client";
import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      // items: [
      //   {
      //     title: "Installation",
      //     url: "#",
      //   },
      //   {
      //     title: "Project Structure",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Create PO",
      url: "/create",
      // items: [
      //   {
      //     title: "Installation",
      //     url: "#",
      //   },
      //   {
      //     title: "Project Structure",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Your PO's",
      url: "/pos",
    },

    // items: [
    //   {
    //     title: "Routing",
    //     url: "#",
    //   },
    //   {
    //     title: "Data Fetching",
    //     url: "#",
    //     isActive: true,
    //   },
    //   {
    //     title: "Rendering",
    //     url: "#",
    //   },
    //   {
    //     title: "Caching",
    //     url: "#",
    //   },
    //   {
    //     title: "Styling",
    //     url: "#",
    //   },
    //   {
    //     title: "Optimizing",
    //     url: "#",
    //   },
    //   {
    //     title: "Configuring",
    //     url: "#",
    //   },
    //   {
    //     title: "Testing",
    //     url: "#",
    //   },
    //   {
    //     title: "Authentication",
    //     url: "#",
    //   },
    //   {
    //     title: "Deploying",
    //     url: "#",
    //   },
    //   {
    //     title: "Upgrading",
    //     url: "#",
    //   },
    //   {
    //     title: "Examples",
    //     url: "#",
    //   },
    // ],
    // },
    // {
    //   title: "API Reference",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Components",
    //       url: "#",
    //     },
    //     {
    //       title: "File Conventions",
    //       url: "#",
    //     },
    //     {
    //       title: "Functions",
    //       url: "#",
    //     },
    //     {
    //       title: "next.config.js Options",
    //       url: "#",
    //     },
    //     {
    //       title: "CLI",
    //       url: "#",
    //     },
    //     {
    //       title: "Edge Runtime",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Architecture",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Accessibility",
    //       url: "#",
    //     },
    //     {
    //       title: "Fast Refresh",
    //       url: "#",
    //     },
    //     {
    //       title: "Next.js Compiler",
    //       url: "#",
    //     },
    //     {
    //       title: "Supported Browsers",
    //       url: "#",
    //     },
    //     {
    //       title: "Turbopack",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Community",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Contribution Guide",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();

  const userInfo = useQuery(api.users.current);

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src={"/icon.png"}
                    className="rounded"
                    alt="NewLife logo"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">New Life PO&apos;s</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "font-medium",
                      pathname === item.url &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {userInfo?.role === "admin" && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={"/all-pos"}
                      className={cn(
                        "font-medium",
                        pathname === "all-pos" &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      All PO&apos;s
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={"/all-pos"}
                      className={cn(
                        "font-medium",
                        pathname === "all-pos" &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      All Budgets
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}
