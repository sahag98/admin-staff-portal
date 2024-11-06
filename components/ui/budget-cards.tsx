import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const BudgetCards = ({
  title,
  className,
}: {
  title: string;
  className: string;
}) => {
  return (
    <Card className={className}>
      <CardContent className="flex h-full flex-1  items-center justify-center">
        <h2>{title}</h2>
      </CardContent>
    </Card>
  );
};

export default BudgetCards;
