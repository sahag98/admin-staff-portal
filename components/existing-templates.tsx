"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { LayoutTemplate, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import SkeletonLoader from "./skeleton-loader";

const ExistingTemplates = () => {
  const templates = useQuery(api.pos.getUserTemplatePos);
  const deleteTemplate = useMutation(api.pos.deleteTemplate);

  if (!templates) {
    return (
      <div className="flex-1 flex flex-col gap-3">
        <LayoutTemplate size={60} />
        <h2 className="text-xl font-semibold">Templates (...)</h2>
        <SkeletonLoader />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col gap-3">
      <section className="flex items-center gap-1">
        <LayoutTemplate size={28} />
        <h2 className="text-xl flex font-semibold gap-2">
          Templates{" "}
          <span className="bg-secondary text-secondary-foreground text-sm flex items-center justify-center rounded-full size-7">
            {templates?.length}
          </span>
        </h2>
      </section>
      {templates?.length === 0 ? (
        <div className="bg-secondary rounded flex-1 h-full flex flex-col gap-2 justify-center items-center">
          <LayoutTemplate size={60} />
          <h3 className="text-lg font-semibold">No templates yet</h3>
          <p className="text-sm">
            To create a template, enable the make template checkbox from within
            the create po page.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-5 grid-cols-1">
          {templates?.map((template) => (
            <Card
              className="bg-secondary flex flex-col justify-between shadow-none p-3"
              key={template._id}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <h2>{template.template_name}</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () =>
                    await deleteTemplate({ template_id: template._id })
                  }
                >
                  <Trash2 className="w-6 h-6 text-red-500" />
                </Button>
              </CardTitle>
              <CardContent>
                <ul className="list-disc">
                  {template.item_name.map((item, idx) => (
                    <li key={idx}>{item.name}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Link
                  href={`/create/new/?template=true&template_id=${template._id}`}
                >
                  <Button>Use Template</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExistingTemplates;
