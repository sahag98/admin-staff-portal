"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { Download, Eye, File, FileIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const IndividualInformationPage = ({
  params,
}: {
  params: { id: Id<"resource"> };
}) => {
  const { id } = params;
  const resource = useQuery(api.resource.getResource, {
    resourceId: id,
  });
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const getFileUrl = useAction(api.files.getUrl);
  const addFilesToResource = useMutation(api.resource.addFilesToResource);
  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const [isUploadingMore, setIsUploadingMore] = useState(false);
  async function handleFileUpload() {
    const fileIds: string[] = [];
    const fileNames: string[] = [];
    if (filesToUpload.length > 0) {
      // Upload each file and collect their IDs
      for (const file of filesToUpload) {
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload file: ${result.statusText}`);
        }

        const { storageId } = await result.json();
        fileIds.push(storageId);
        fileNames.push(file.name);
      }
    }

    return { fileIds, fileNames };
  }

  const handleUpdateFiles = async () => {
    setIsUploadingMore(true);
    const { fileIds, fileNames } = await handleFileUpload();

    await addFilesToResource({
      resourceId: id,
      fileIds,
      fileNames,
    });
    setIsUploadingMore(false);
    setFilesToUpload([]); // Clear the file input
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
                <BreadcrumbLink href="/policies">Policies</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{resource?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between mb-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Files</h1>
              {/* <p className="text-muted-foreground mt-2">
                View and manage your files
              </p> */}
            </div>

            {filesToUpload.length === 0 ? (
              <Button variant={"outline"}>
                <Label
                  htmlFor="file"
                  className="flex items-center cursor-pointer"
                >
                  <Input
                    id="file"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files) {
                        setFilesToUpload(Array.from(files));
                      }
                    }}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <Plus className="mr-2 h-4 w-4" />
                  Select More Files
                </Label>
              </Button>
            ) : (
              <Button disabled={isUploadingMore} onClick={handleUpdateFiles}>
                {isUploadingMore ? "Please wait..." : "Upload"}
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>

                    <TableHead>Type</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resource?.fileNames.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          {file}
                        </div>
                      </TableCell>

                      <TableCell>
                        {file
                          .substring(file.lastIndexOf(".") + 1)
                          .toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {new Date(resource._creationTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={async () => {
                              const url = await getFileUrl({
                                storageId: resource.fileIds[index],
                              });

                              if (!url) return;
                              window.open(url, "_blank");
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            <a target="_blank">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View file</span>
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default IndividualInformationPage;
