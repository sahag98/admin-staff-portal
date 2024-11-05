"use client";
import React from "react";
import { BreadcrumbPage } from "./ui/breadcrumb";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const UserName = ({ userId }: { userId: Id<"users"> }) => {
  const user = useQuery(api.users.getUserById, { userId });

  if (!user) {
    return;
  }
  return <BreadcrumbPage>{user?.name + " PO's"}</BreadcrumbPage>;
};

export default UserName;
