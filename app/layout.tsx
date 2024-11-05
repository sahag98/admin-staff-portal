import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body>
          <SidebarProvider>
            {/* <SidebarTrigger /> */}
            {/* <AppSidebar /> */}
            <NextTopLoader color="black" />
            {children}
            <Toaster />
          </SidebarProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
