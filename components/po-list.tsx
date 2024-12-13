"use client";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useRouter } from "next/navigation";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PurchaseOrdersTable({
  preloadedPOs,
}: {
  preloadedPOs: Preloaded<typeof api.pos.getUserPos>;
}) {
  const yourPOs = usePreloadedQuery(preloadedPOs);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const sortedOrders = yourPOs?.sort((a, b) => {
    if (sortColumn === null) return 0;

    //@ts-expect-error any
    const aValue = a[sortColumn];
    //@ts-expect-error any
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

  // Calculate pagination
  const totalPages = Math.ceil((sortedOrders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedOrders?.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (yourPOs?.length === 0) {
    return (
      <div className="flex items-center gap-2 justify-center flex-col h-screen">
        <WalletCards size={80} />
        <p>You haven&apos;t created any purchase orders yet.</p>
      </div>
    );
  }

  if (!yourPOs) {
    return;
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="rounded-md border min-w-[640px]">
          <Table>
            <TableHeader>
              <TableRow className="">
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
                  <Button variant="ghost">Budget #</Button>
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
                  onClick={() => router.push(`/pos/${order._id}`)}
                  key={order._id}
                >
                  {/* <TableCell className="font-medium">{order._id}</TableCell> */}
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
                  <TableCell className="px-2 text-center w-16">
                    ${order.amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="px-2 text-center w-16">
                    {new Date(order.required_by).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.po_status.status === "approved" ? (
                      <Badge className="shadow-none" variant="default">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                      </Badge>
                    ) : order.po_status.status === "denied" ? (
                      <Badge className="shadow-none" variant="destructive">
                        <X className="w-4 h-4 mr-1" />
                        Denied
                      </Badge>
                    ) : order.po_status.status === "voided" ? (
                      <Badge className="shadow-none" variant="outline">
                        <X className="w-4 h-4 mr-1" />
                        Voided
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
                          onClick={() => router.push(`/pos/${order._id}`)}
                        >
                          View details
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

      {/* Add pagination controls */}
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
