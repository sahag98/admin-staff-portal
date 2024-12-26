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
  Check,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { sendUpdate } from "@/actions/send-update";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export default function PurchaseOrdersTable({ user }: { user: Id<"users"> }) {
  const yourPOs = useQuery(api.pos.getUserPosById, { user });
  const currentUser = useQuery(api.users.current);
  const POUser = useQuery(api.users.getUserById, { userId: user });
  const { user: currUser } = useUser();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const updateReconcile = useMutation(api.pos.updatePOReconcile);
  const [denyReason, setDenyReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<Id<"pos"> | null>(
    null
  );
  const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
  const [voidReason, setVoidReason] = useState("");

  // console.log("pos: ", JSON.stringify(yourPOs[0].is_reconciled, null, 2));

  const sortedOrders = yourPOs?.sort((a, b) => {
    if (sortColumn === null) return 0;
    // console.log("sortColumn: ", sortColumn);
    // console.log("a sort: ", a["is_reconciled"]);
    //@ts-expect-error any
    const aValue = a[sortColumn];
    // console.log("a value: ", aValue);
    //@ts-expect-error any
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    console.log("column: ", column);
    // console.log("sort columnt: ", sortColumn);
    if (sortColumn === column) {
      console.log("should sort");
      console.log("direction: ", sortDirection);
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const totalPages = Math.ceil((sortedOrders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedOrders?.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const updateStatus = useMutation(api.pos.updatePOStatus);
  // const getCurrentPO = useQuery(api.pos.getPo);

  const exportToExcel = (fileName = "table2024.xlsx") => {
    console.log("EXPORTING TO EXCEL");
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(yourPOs!);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the file
    XLSX.writeFile(workbook, fileName);
  };

  const handleApprove = async (orderId: Id<"pos">) => {
    try {
      // console.log(currentPO);

      // if (orderId) {
      //   const curr = await getCurrentPO({ poId: orderId });
      // }

      const po = await updateStatus({
        po_id: orderId,
        user_name: currentUser?.name,
        status: "approved",
      });
      console.log("po email: ", po?.email);
      if (po && currentUser && currUser) {
        sendUpdate(
          po?.email,
          po.item_name,
          currentUser.name,
          currUser?.emailAddresses[0]?.emailAddress,
          po.amount,
          "Approved"
        );
      }
    } catch (error) {
      console.error("Failed to approve PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  const openDenyDialog = (orderId: Id<"pos">) => {
    setSelectedOrderId(orderId);
    setIsDialogOpen(true);
  };

  const handleDenySubmit = async () => {
    if (selectedOrderId) {
      await handleDeny(selectedOrderId, denyReason);
      setIsDialogOpen(false);
      setDenyReason("");
    }
  };

  const handleDeny = async (orderId: Id<"pos">, reason: string) => {
    try {
      const po = await updateStatus({
        po_id: orderId,
        user_name: currentUser?.name,
        status: "denied",
        reason, // Pass the reason to the API
      });

      if (po && currentUser && currUser) {
        sendUpdate(
          po.email,
          po.item_name,
          currentUser.name,
          currUser?.emailAddresses[0]?.emailAddress,
          po.amount,
          "Denied",
          reason // Include the reason in the update
        );
      }
    } catch (error) {
      console.error("Failed to deny PO:", error);
    }
  };

  const openVoidDialog = (orderId: Id<"pos">) => {
    setSelectedOrderId(orderId);
    setIsVoidDialogOpen(true);
  };

  const handleVoidSubmit = async () => {
    if (selectedOrderId) {
      await handleVoid(selectedOrderId, voidReason);
      setIsVoidDialogOpen(false);
      setVoidReason("");
    }
  };

  const handleVoid = async (orderId: Id<"pos">, reason: string) => {
    try {
      const po = await updateStatus({
        po_id: orderId,
        user_name: currentUser?.name,
        status: "voided",
        reason, // Pass the reason to the API
      });

      if (po && currentUser && currUser) {
        sendUpdate(
          po.email,
          po.item_name,
          currentUser.name,
          currUser?.emailAddresses[0]?.emailAddress,
          po.amount,
          "Voided",
          reason // Include the reason in the update
        );
      }
    } catch (error) {
      console.error("Failed to void PO:", error);
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
      <div className="overflow-x-auto  flex flex-col">
        <Button
          onClick={() =>
            exportToExcel(
              `${POUser?.name}-POS-${new Date().getFullYear()}.xlsx`
            )
          }
          className="ml-auto mb-4"
        >
          Export to Excel
        </Button>
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
                <TableHead className="px-2 text-right">
                  <Button variant="ghost">PO #</Button>
                </TableHead>
                <TableHead className="px-2 text-start">
                  <Button variant="ghost" onClick={() => handleSort("vendor")}>
                    Vendor(s)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("item")}>
                    Item(s)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-2 text-right">
                  <Button variant="ghost" onClick={() => handleSort("item")}>
                    Budget #
                  </Button>
                </TableHead>
                <TableHead className="px-2 text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("is_reconciled")}
                  >
                    R
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-2 text-right">
                  <Button variant="ghost" onClick={() => handleSort("amount")}>
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

                <TableHead className="px-2 text-right">
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
              {currentItems?.map((order) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => router.push(`/pos/${order._id}?admin=true`)}
                  key={order._id}
                >
                  <TableCell className=" px-2 text-center w-10">
                    {order.po_number || "N/A"}
                  </TableCell>
                  <TableCell className="px-2 flex-1 max-w-2/5 w-1/3">
                    {order.vendor}
                  </TableCell>
                  <TableCell className="text-ellipsis w-1/3 max-w-1/3 flex-1">
                    <section className="flex flex-wrap items-center gap-2">
                      {order.item_name.map((item, index) => (
                        <section
                          className="flex bg-secondary rounded-md px-2 py-1 items-center"
                          key={index}
                        >
                          <div className="flex items-center gap-1">
                            <p>{item.name}</p>
                            <span>x</span>
                            <p>{item.quantity}</p>
                          </div>
                        </section>
                      ))}
                      {/* {order.item_name.length > 3 && <p>And more...</p>} */}
                    </section>
                  </TableCell>
                  <TableCell className="px-2 text-center w-10">
                    {order.budget_num?.budget_num || "N/A"}
                  </TableCell>

                  <TableCell
                    className="px-5 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("trying to reconcile");
                      updateReconcile({ po_id: order._id });
                    }}
                  >
                    <div className="size-5 flex items-center justify-center rounded-md border-2">
                      {order.is_reconciled && (
                        <Check color={order.is_reconciled ? "green" : "red"} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-center w-16">
                    ${order.amount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {new Date(order.required_by).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.po_status.status === "approved" ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="shadow-none" variant="default">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approved
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary border">
                          <p className="text-secondary-foreground font-medium">
                            by {order.po_status.by}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : order.po_status.status === "denied" ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="shadow-none" variant="destructive">
                            <X className="w-4 h-4 mr-1" />
                            Denied
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary border">
                          <p className="text-secondary-foreground font-medium">
                            by {order.po_status.by}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : order.po_status.status === "pending" ? (
                      <Badge className="shadow-none" variant="secondary">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </Badge>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="shadow-none" variant="outline">
                            <Clock className="w-4 h-4 mr-1" />
                            Voided
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary border">
                          <p className="text-secondary-foreground font-medium">
                            by {order.po_status.by}
                          </p>
                        </TooltipContent>
                      </Tooltip>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/pos/${order._id}?admin=true`);
                          }}
                        >
                          View details
                        </DropdownMenuItem>
                        {currentUser?._id !== order.user && (
                          <>
                            <DropdownMenuSeparator />
                            {order.po_status.status !== "approved" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(order._id);
                                }}
                                className="text-green-500"
                              >
                                Approve
                              </DropdownMenuItem>
                            )}
                            {order.po_status.status !== "denied" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDenyDialog(order._id);
                                }}
                                className="text-red-500"
                              >
                                Deny
                              </DropdownMenuItem>
                            )}
                            {order.po_status.status !== "voided" && (
                              <DropdownMenuItem
                                onClick={() => openVoidDialog(order._id)}
                                className=""
                              >
                                Void
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Purchase Order</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for denial"
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleDenySubmit}>Submit</Button>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isVoidDialogOpen} onOpenChange={setIsVoidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Void Purchase Order</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for voiding"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleVoidSubmit}>Submit</Button>
            <Button variant="ghost" onClick={() => setIsVoidDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {yourPOs && yourPOs?.length > 10 && (
        <div className="mt-4 flex">
          <Pagination className="self-end justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
