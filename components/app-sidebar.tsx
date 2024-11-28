"use client";
import * as React from "react";
import {
  Calculator,
  ChartColumnBig,
  ChevronRight,
  ClipboardList,
  Info,
  LogOut,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <ChartColumnBig size={20} />,
    },
    {
      title: "PO",
      url: "/pos",
      icon: <ClipboardList size={20} />,
      items: [
        {
          title: "Create PO",
          url: "/create",
        },
        {
          title: "Your POs",
          url: "/pos",
        },
      ],
    },
    // {
    //   title: "Your POs",
    //   url: "/pos",
    // },
    {
      title: "Budget",
      url: "/budget",
      icon: <Calculator size={20} />,
      items: [
        {
          title: "Your Budget",
          url: "/budget",
        },
      ],
    },
    {
      title: "Policies and Procedures",
      url: "/policies-and-procedures",
      icon: <Shield size={20} />,
      items: [
        {
          title: "Policies",
          url: "/policies",
        },
        {
          title: "Procedures",
          url: "/procedures",
        },
      ],
    },
    {
      title: "Information",
      url: "/information",
      icon: <Info size={20} />,
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

export function AppSidebar({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.current>;
}) {
  const pathname = usePathname();

  const userInfo = usePreloadedQuery(preloadedUser);

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src={"/icon.png"}
                    className="rounded"
                    alt="NewLife logo"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">New Life Staff Portal</span>
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
              <React.Fragment key={item.title}>
                {item.title === "Dashboard" ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "font-medium",
                          pathname === "/"
                            ? "bg-sidebar-accent transition-all text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            : "hover:bg-sidebar-accent transition-all"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : item.title === "Information" ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "font-medium",
                          pathname === "/information"
                            ? "bg-sidebar-accent transition-all text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            : "hover:bg-sidebar-accent transition-all"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible
                    key={item.title}
                    title={item.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarGroup>
                      <SidebarGroupLabel
                        asChild
                        className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <CollapsibleTrigger className=" p-5">
                          <span className="mr-2">{item.icon}</span>
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        {/* <SidebarGroupContent> */}
                        <SidebarMenuSub>
                          {item.items?.length !== 0 &&
                            item.items?.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  className="p-3 hover:bg-sidebar-accent/50 transition-all"
                                  asChild
                                  isActive={pathname === item.url}
                                >
                                  <Link
                                    href={
                                      item.url === "/budget"
                                        ? `${item.url}/${userInfo?._id}`
                                        : item.url
                                    }
                                  >
                                    {item.title}
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                        </SidebarMenuSub>
                        {/* </SidebarGroupContent> */}
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                )}
              </React.Fragment>
            ))}
            {userInfo?.role === "admin" && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={"/all-pos"}
                      className={cn(
                        "font-medium",
                        pathname === "/all-pos"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent transition-all"
                      )}
                    >
                      All POs
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={"/all-budgets"}
                      className={cn(
                        "font-medium",
                        pathname === "/all-budgets"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent transition-all"
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
          <Button>
            <LogOut />
            Sign out
          </Button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}
