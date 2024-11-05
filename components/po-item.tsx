import React from "react";
import { Button } from "./ui/button";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { User } from "@clerk/nextjs/server";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const PoItem = ({ po, user }: { po: Doc<"pos">; user: Doc<"users"> }) => {
  const approvePO = useMutation(api.pos.approvePO);

  const handleApprovePO = () => {
    approvePO({ po_id: po._id });
  };
  return (
    <div
      className="bg-background  space-y-3 p-2 border rounded-md"
      key={po._id}
    >
      <p className="font-semibold text-lg">{po.item}</p>
      <p>Amount: ${po.amount}</p>
      <div
        className={cn(
          "mt-5 w-fit px-2 py-1 rounded-lg",
          po.status === "pending" && "bg-orange-300",
          po.status === "Approved" && "bg-green-400",
          po.status === "declined" && "bg-red-400"
        )}
      >
        <p className="text-sm">Status: {po.status}</p>
      </div>
      {user && user.role === "admin" && po.status === "pending" && (
        <section className="space-x-2">
          <Button className="font-bold" variant={"destructive"}>
            Decline
          </Button>
          <Button onClick={handleApprovePO} className="font-bold">
            Accept
          </Button>
        </section>
      )}
    </div>
  );
};

export default PoItem;
