"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { File, Upload, X } from "lucide-react";
import { Input } from "./ui/input";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";

const UploadFiles = ({ type }: { type: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const currentUser = useQuery(api.users.current);
  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const createResource = useMutation(api.resource.createResource);
  const [isUploading, setIsUploading] = useState(false);
  async function handleFileUpload() {
    const fileIds: string[] = [];
    const fileNames: string[] = [];
    if (files.length > 0) {
      // Upload each file and collect their IDs
      for (const file of files) {
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
  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  async function handleUpload() {
    setIsUploading(true);
    const { fileIds, fileNames } = await handleFileUpload();

    await createResource({ title: title, fileIds, fileNames, type: type });
    setFiles([]);
    setTitle("");
    setIsUploading(false);
  }

  if (currentUser?.role !== "admin") {
    return;
  }

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {files.length > 0 && (
        <div className="flex mb-3 text-blue-500 items-center gap-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex text-blue-500 bg-secondary rounded-lg items-center gap-2"
            >
              <File size={15} />
              <span className="text-sm">{file.name}</span>
              <X
                onClick={() => removeFile(file)}
                className="ml-auto cursor-pointer text-red-500"
              />
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3">
        <Label
          htmlFor="file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX up to 10MB
            </p>
          </div>
          <Input
            id="file"
            onChange={(event) => {
              const files = event.target.files;
              if (files) {
                setFiles(Array.from(files));
              }
            }}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
        </Label>
        <Button disabled={isUploading} onClick={handleUpload}>
          {isUploading ? "Please wait..." : `Upload ${type}`}
        </Button>
      </div>
    </div>
  );
};

export default UploadFiles;
