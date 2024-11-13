"use client";

import { sendUpdate } from "@/actions/send-update";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useAction, useMutation } from "convex/react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const PoIndividualPage = ({ params }: { params: { id: Id<"pos"> } }) => {
  const { id } = params;
  console.log(id);
  const router = useRouter();

  const searchParams = useSearchParams();

  const isAdmin = searchParams.get("admin");

  console.log("is admin: ", isAdmin);

  const po = useQuery(api.pos.getPo, {
    poId: id,
  });

  const getFileUrl = useAction(api.files.getUrl);

  const updateStatus = useMutation(api.pos.updatePOStatus);

  const handleApprove = async () => {
    try {
      // console.log(currentPO);

      // if (orderId) {
      //   const curr = await getCurrentPO({ poId: orderId });
      // }

      const po = await updateStatus({ po_id: id, status: "approved" });

      if (po) {
        sendUpdate(po?.email, po.item_name, po.amount, "Approved");
      }
    } catch (error) {
      console.error("Failed to approve PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  const handleDeny = async () => {
    try {
      const po = await updateStatus({ po_id: id, status: "denied" });

      if (po) {
        sendUpdate(po.email, po.item_name, po.amount, "Denied");
      }
    } catch (error) {
      console.error("Failed to deny PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  const handleVoid = async () => {
    try {
      const po = await updateStatus({ po_id: id, status: "voided" });

      if (po) {
        sendUpdate(po.email, po.item_name, po.amount, "Voided");
      }
    } catch (error) {
      console.error("Failed to void PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{isAdmin ? "PO" : "Your POs"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              {isAdmin ? (
                <Button
                  onClick={() => router.push("/all-pos")}
                  variant={"ghost"}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              ) : (
                <Link
                  href={"/pos"}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {"Back to Purchase Orders"}
                </Link>
              )}

              <Badge
                variant={
                  po?.status === "approved"
                    ? "default"
                    : po?.status === "denied"
                      ? "destructive"
                      : po?.status === "voided"
                        ? "outline"
                        : "secondary"
                }
                className="h-6"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {po?.status === "approved"
                  ? "Approved"
                  : po?.status === "denied"
                    ? "Denied"
                    : po?.status === "voided"
                      ? "Voided"
                      : "Pending"}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold">Purchase Order</h1>
              </CardHeader>
              <CardContent className="space-y-6">
                <Table className="bg-secondary rounded-md">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {po?.item_name?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <p>{item.name}</p>
                        </TableCell>
                        <TableCell>
                          <p>{item.quantity}</p>
                        </TableCell>
                        <TableCell>
                          <p>${item.price}</p>
                        </TableCell>
                        <TableCell>${item.price * item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Created At
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {po?._creationTime
                        ? new Date(po._creationTime).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Required By
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {po?.required_by
                          ? new Date(po.required_by).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Priority
                    </div>
                    <div className="flex items-center">{po?.priority}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Vendor(s)
                    </div>
                    <div className="flex items-center">{po?.vendor}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Type of Expense
                    </div>
                    <div className="flex items-center">{po?.expense_type}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Event(s)
                    </div>
                    <div className="flex items-center">{po?.event_name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Ministry
                    </div>
                    <div className="flex items-center">{po?.ministry}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Is PO Budgeted?
                    </div>
                    <div className="flex items-center">{po?.isBudgeted}</div>
                  </div>
                  {po?.budget_num ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        PO Number
                      </div>
                      <div className="flex items-center">{po.budget_num}</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        If not, who approved?
                      </div>
                      <div className="flex items-center">
                        {po?.nonbudget_approval ?? "N/A"}
                      </div>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Total Amount
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {po?.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Additional Notes
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-sm">
                      {po?.message
                        ? po.message
                        : " No additional notes provided for this purchase order."}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    disabled={!po?.fileIds || po.fileIds.length === 0}
                    onClick={async () => {
                      if (po?.fileIds && po.fileIds.length > 0) {
                        const urls = [];
                        for (const fileId of po.fileIds) {
                          const url = await getFileUrl({ storageId: fileId });
                          if (url) {
                            urls.push(url);
                          }
                        }
                        const linksHtml = urls
                          .map(
                            (url, index) =>
                              `<p><a href="${url}" target="_blank">PO Attachment ${index + 1}</a></p>`
                          )
                          .join("");
                        const newTab = window.open();
                        newTab?.document.write(`<div>${linksHtml}</div>`);
                        newTab?.document.close();
                      }
                    }}
                  >
                    Download Attachments ({po?.fileIds?.length ?? 0})
                  </Button>

                  {isAdmin && (
                    <>
                      {po?.status !== "voided" && (
                        <Button variant="outline" onClick={handleVoid}>
                          Void
                        </Button>
                      )}
                      {po?.status !== "denied" && (
                        <Button variant="destructive" onClick={handleDeny}>
                          Deny
                        </Button>
                      )}
                      {po?.status !== "approved" && (
                        <Button variant="success" onClick={handleApprove}>
                          Approve
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* <div className="p-4">
          <PurchaseOrdersTable pos={yourPOs} />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PoIndividualPage;
