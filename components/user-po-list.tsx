"use client";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  CheckCircle,
  Clock,
  MoreHorizontal,
  ArrowUpDown,
  WalletCards,
  X,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sendUpdate } from "@/actions/send-update";

export default function PurchaseOrdersTable({ user }: { user: Id<"users"> }) {
  const yourPOs = useQuery(api.pos.getUserPosById, { user });

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const sortedOrders = yourPOs?.sort((a, b) => {
    if (sortColumn === null) return 0;

    //@ts-ignore
    const aValue = a[sortColumn];
    //@ts-ignore
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const updateStatus = useMutation(api.pos.updatePOStatus);
  // const getCurrentPO = useQuery(api.pos.getPo);

  const handleApprove = async (orderId: Id<"pos">) => {
    try {
      // console.log(currentPO);

      // if (orderId) {
      //   const curr = await getCurrentPO({ poId: orderId });
      // }

      const po = await updateStatus({ po_id: orderId, status: "approved" });

      if (po) {
        sendUpdate(po?.email, po.item_name, po.amount, "Approved");
      }
    } catch (error) {
      console.error("Failed to approve PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  const handleDeny = async (orderId: Id<"pos">) => {
    try {
      const po = await updateStatus({ po_id: orderId, status: "denied" });

      if (po) {
        sendUpdate(po.email, po.item_name, po.amount, "Denied");
      }
    } catch (error) {
      console.error("Failed to deny PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  if (yourPOs?.length === 0) {
    return (
      <div className="flex items-center gap-2 justify-center flex-col h-screen">
        <WalletCards size={80} />
        <p>No purchase orders yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="rounded-md border min-w-[640px]">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort("id")}>
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead> */}
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("item")}>
                    Item(s)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("amount")}>
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("date")}>
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("date")}>
                    Required By
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders?.map((order) => (
                <TableRow key={order._id}>
                  {/* <TableCell className="font-medium">{order._id}</TableCell> */}
                  <TableCell className="text-ellipsis">
                    {order.item_name}
                  </TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(order._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.required_by).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.status === "approved" ? (
                      <Badge className="shadow-none" variant="default">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                      </Badge>
                    ) : order.status === "denied" ? (
                      <Badge className="shadow-none" variant="destructive">
                        <X className="w-4 h-4 mr-1" />
                        Denied
                      </Badge>
                    ) : (
                      <Badge className="shadow-none" variant="secondary">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/pos/${order._id}?admin=true`)
                          }
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleApprove(order._id)}
                          className="text-green-500"
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeny(order._id)}
                          className="text-red-500"
                        >
                          Deny
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
