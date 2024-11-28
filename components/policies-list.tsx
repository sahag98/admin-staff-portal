"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useAction, usePreloadedQuery } from "convex/react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Shield } from "lucide-react";
import Link from "next/link";

const PoliciesList = ({
  preloadedPolicies,
}: {
  preloadedPolicies: Preloaded<typeof api.resource.getPolicies>;
}) => {
  const policies = usePreloadedQuery(preloadedPolicies);
  const getFileUrl = useAction(api.files.getUrl);

  if (policies?.length === 0) {
    return;
  }
  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-lg">Policies:</h1>
      <div className="grid md:grid-cols-4 gap-4 sm:grid-cols-2 grid-cols-1">
        {policies?.map((policy) => (
          <Card className="flex flex-col justify-between" key={policy._id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <h1 className="font-bold text-xl">{policy.title}</h1>

              <Shield size={25} />
            </CardHeader>
            <CardContent>
              <h2 className="font-semibold">Files:</h2>
              <ul className="list-disc">
                {policy.fileNames.slice(0, 4).map((name, i) => (
                  <li className="text-sm" key={i}>
                    {name}
                  </li>
                ))}
                {policy.fileNames.length > 4 && (
                  <p className="text-sm">and more</p>
                )}
              </ul>
            </CardContent>
            <CardFooter className="p-2 mt-auto">
              <Button className="w-full" asChild>
                <Link href={`/policies/${policy._id}`}>Open</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PoliciesList;
