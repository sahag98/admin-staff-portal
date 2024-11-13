import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import NextTopLoader from "nextjs-toploader";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body className="max-w-[2800px] flex items-center justify-center">
          <SidebarProvider>
            <TooltipProvider>
              {/* <SidebarTrigger /> */}
              {/* <AppSidebar /> */}
              <NextTopLoader color="black" />
              {children}
              <Toaster />
            </TooltipProvider>
          </SidebarProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
