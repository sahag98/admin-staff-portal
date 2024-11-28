"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Info } from "lucide-react";
import Link from "next/link";

const InformationList = ({
  preloadedInformations,
}: {
  preloadedInformations: Preloaded<typeof api.resource.getProcedures>;
}) => {
  const informations = usePreloadedQuery(preloadedInformations);

  if (informations?.length === 0) {
    return;
  }
  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-lg">Informations:</h1>
      <div className="grid md:grid-cols-4 gap-4 sm:grid-cols-2 grid-cols-1">
        {informations?.map((information) => (
          <Card className="flex flex-col justify-between" key={information._id}>
            <CardHeader className="flex p-3 flex-row justify-between items-center">
              <h1 className="font-bold text-xl">{information.title}</h1>

              <Info size={25} />
            </CardHeader>
            <CardContent>
              <h2 className="font-semibold">Files:</h2>
              <ul className="list-disc">
                {information.fileNames.map((name, i) => (
                  <li className="text-sm" key={i}>
                    {name}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-2 mt-auto">
              <Button className="w-full" asChild>
                <Link href={`/information/${information._id}`}>Open</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InformationList;
