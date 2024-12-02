"use client";
import { sendUpdate } from "@/actions/send-update";
import { Badge } from "@/components/ui/badge";
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
import { useAuth, useUser } from "@clerk/nextjs";

const PoIndividualPage = ({ params }: { params: { id: Id<"pos"> } }) => {
  const { id } = params;
  const currentUser = useQuery(api.users.current);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  console.log(user?.emailAddresses[0].emailAddress);
  const searchParams = useSearchParams();

  const isAdmin = searchParams.get("admin");

  const po = useQuery(api.pos.getPo, {
    poId: id,
  });

  const getFileUrl = useAction(api.files.getUrl);

  const updateStatus = useMutation(api.pos.updatePOStatus);

  const handleApprove = async () => {
    try {
      const po = await updateStatus({
        po_id: id,
        user_name: currentUser?.name,
        status: "approved",
      });

      if (po && currentUser && user) {
        sendUpdate(
          po?.email,
          po.item_name,
          currentUser?.name,
          user?.emailAddresses[0]?.emailAddress,
          po.amount,
          "Approved"
        );
      }
    } catch (error) {
      console.error("Failed to approve PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  const handleDeny = async () => {
    try {
      const po = await updateStatus({
        po_id: id,
        user_name: currentUser?.name,
        status: "denied",
      });

      if (po && currentUser && user) {
        sendUpdate(
          po.email,
          po.item_name,
          currentUser?.name,
          user?.emailAddresses[0]?.emailAddress,
          po.amount,
          "Denied"
        );
      }
    } catch (error) {
      console.error("Failed to deny PO:", error);
      // You might want to add proper error handling/notification here
    }
  };

  const handleVoid = async () => {
    try {
      const po = await updateStatus({
        po_id: id,
        user_name: currentUser?.name,
        status: "voided",
      });

      if (po && currentUser && user) {
        sendUpdate(
          po.email,
          po.item_name,
          currentUser?.name,
          user?.emailAddresses[0]?.emailAddress,
          po.amount,
          "Voided"
        );
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
      <SidebarInset>
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              {isAdmin ? (
                <Button onClick={() => router.back()} variant={"ghost"}>
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
                  po?.po_status.status === "approved"
                    ? "default"
                    : po?.po_status.status === "denied"
                      ? "destructive"
                      : po?.po_status.status === "voided"
                        ? "outline"
                        : "secondary"
                }
                className="h-6"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {po?.po_status.status === "approved"
                  ? `Approved by ${po.po_status.by}`
                  : po?.po_status.status === "denied"
                    ? `Denied by ${po.po_status.by}`
                    : po?.po_status.status === "voided"
                      ? `Voided by ${po.po_status.by}`
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

                <div className="grid gap-4 md:grid-cols-3">
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
                      Payment Term
                    </div>
                    <div className="flex items-center">{po?.payment_term}</div>
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
                      <div className="flex items-center">{`${po.budget_num.budget_num} - ${po.budget_num.description}`}</div>
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

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-lg font-bold">Attachments</h2>
                  {po?.fileIds.length === 0 ? (
                    <div>
                      <span>No attachments</span>
                    </div>
                  ) : (
                    <Table className="bg-secondary rounded-md">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attachment</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {po?.fileIds?.map((fileId, index) => (
                          <TableRow key={index}>
                            <TableCell>{po.fileNames[index]}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                onClick={async () => {
                                  const url = await getFileUrl({
                                    storageId: fileId,
                                  });
                                  if (url) {
                                    window.open(url, "_blank");
                                  }
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  {isAdmin && po?.user !== currentUser?._id && (
                    <>
                      {po?.po_status.status !== "voided" && (
                        <Button variant="outline" onClick={handleVoid}>
                          Void
                        </Button>
                      )}
                      {po?.po_status.status !== "denied" && (
                        <Button variant="destructive" onClick={handleDeny}>
                          Deny
                        </Button>
                      )}
                      {po?.po_status.status !== "approved" && (
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
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PoIndividualPage;
