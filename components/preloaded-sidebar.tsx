import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import { AppSidebar } from "./app-sidebar";

const PreloadedSidebar = async () => {
  const preloadedUser = await preloadQuery(api.users.current);
  return <AppSidebar preloadedUser={preloadedUser} />;
};

export default PreloadedSidebar;
