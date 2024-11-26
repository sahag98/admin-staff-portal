"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { Badge } from "./ui/badge";

const ApprovalBanner = ({ user }: { user: Doc<"users"> }) => {
  const userPOs = useQuery(api.pos.getUserPosById, { user: user._id });

  const unapprovedPOS = userPOs?.filter(
    (po) => po.po_status.status === "pending"
  );

  if (unapprovedPOS?.length == 0) return;
  return (
    <Badge className="border-orange-300" variant={"outline"}>
      <p className="text-xs font-semibold">Approval: {unapprovedPOS?.length}</p>
    </Badge>
  );
};

export default ApprovalBanner;
