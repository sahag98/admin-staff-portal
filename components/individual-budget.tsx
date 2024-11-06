"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

// export const mockBudgetItems = [
//   "Camera Equipment",
//   "Lighting Equipment",
//   "Audio Equipment",
//   "Software Licenses",
//   "Studio Rental",
//   "Production Staff",
//   "Post-Production Tools",
//   "Training & Development",
//   "Equipment Maintenance",
//   "Miscellaneous Production Costs",
// ];

export const mockBudgetItems = [
  { title: "Squarespace Website", budget_num: 100 },
  { title: "Squarespace Domain", budget_num: 101 },
  { title: "Restream", budget_num: 102 },
  { title: "Dropbox Team", budget_num: 103 },
  { title: "Microsoft Office", budget_num: 104 },
  { title: "ProPresenter 7", budget_num: 105 },
  { title: "SundaySocial", budget_num: 106 },
  { title: "Apple Music", budget_num: 107 },
];

const calculateVariance = (proposed: number, actual: number): number => {
  return proposed - (actual || 0);
};

export default function IndividualBudget({ userId }: { userId: Id<"users"> }) {
  const userInfo = useQuery(api.users.current);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditing, setIsEditing] = useState(false);

  const user = useQuery(api.users.getUserById, { userId });
  const budget = useQuery(api.budgets.getBudgetByYear, {
    year: selectedYear,
    userId,
  });

  const updateBudget = useMutation(api.budgets.updateBudgetItem);

  const [editedBudgets, setEditedBudgets] = useState<{
    [key: string]: { proposed: number; actual: number };
  }>({});

  useEffect(() => {
    setEditedBudgets({});
    setIsEditing(false);
  }, [selectedYear, selectedMonth]);

  if (!user) return <div>Loading...</div>;

  const monthlyBudget = budget?.monthlyBudgets.find(
    (mb) => mb.month === selectedMonth
  ) || {
    proposedBudget: 0,
    actualBudget: 0,
    itemBudgets: mockBudgetItems.map((title) => ({
      title,
      proposed: 0,
      actual: 0,
    })),
  };

  const handleSave = async () => {
    const itemBudgets = mockBudgetItems.map((item, index) => {
      const currentEdits = editedBudgets[index];
      const currentBudgetItem = monthlyBudget.itemBudgets?.[index];

      return {
        title: item.title,
        proposed:
          currentEdits?.proposed ??
          currentBudgetItem?.proposed ??
          monthlyBudget.proposedBudget / mockBudgetItems.length,
        actual:
          currentEdits?.actual ??
          currentBudgetItem?.actual ??
          (monthlyBudget.actualBudget || 0) / mockBudgetItems.length,
      };
    });

    const totalProposed = itemBudgets.reduce(
      (sum, item) => sum + item.proposed,
      0
    );
    const totalActual = itemBudgets.reduce(
      (sum, item) => sum + (item.actual || 0),
      0
    );

    try {
      await updateBudget({
        userId,
        year: selectedYear,
        month: selectedMonth,
        proposedBudget: totalProposed,
        actualBudget: totalActual,
        itemBudgets: itemBudgets,
      });

      setIsEditing(false);
      setEditedBudgets({});
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  const handleEdit = (
    itemIndex: number,
    type: "proposed" | "actual",
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setEditedBudgets((prev) => ({
      ...prev,
      [itemIndex]: {
        proposed:
          type === "proposed"
            ? numValue
            : prev[itemIndex]?.proposed ||
              monthlyBudget.proposedBudget / mockBudgetItems.length,
        actual:
          type === "actual"
            ? numValue
            : prev[itemIndex]?.actual ||
              (monthlyBudget.actualBudget || 0) / mockBudgetItems.length,
      },
    }));
  };

  // Calculate totals
  const totalProposed =
    mockBudgetItems.length *
    (monthlyBudget.proposedBudget / mockBudgetItems.length);
  const totalActual = monthlyBudget.actualBudget || 0;
  const totalVariance = calculateVariance(totalProposed, totalActual);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Budget Overview for {user.name}
            </CardTitle>
            {userInfo?.role === "admin" && (
              <>
                {isEditing ? (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
              </>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <div className="w-[200px]">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[200px]">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Budget #</TableHead>
                <TableHead className="text-right">Proposed Budget</TableHead>
                <TableHead className="text-right">Actual Budget</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBudgetItems.map((item, index) => {
                const budgetItem = monthlyBudget.itemBudgets?.[index] || {
                  title: item,
                  po_number: item.budget_num,
                  proposed:
                    monthlyBudget.proposedBudget / mockBudgetItems.length,
                  actual:
                    (monthlyBudget.actualBudget || 0) / mockBudgetItems.length,
                };

                const itemProposed =
                  editedBudgets[index]?.proposed ?? budgetItem.proposed;
                const itemActual =
                  editedBudgets[index]?.actual ?? (budgetItem.actual || 0);
                const variance = calculateVariance(itemProposed, itemActual);

                return (
                  <TableRow key={item.budget_num}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>PO#{item.budget_num}</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={itemProposed}
                          onChange={(e) =>
                            handleEdit(index, "proposed", e.target.value)
                          }
                          className="w-32 ml-auto"
                        />
                      ) : (
                        `$${itemProposed.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={itemActual}
                          onChange={(e) =>
                            handleEdit(index, "actual", e.target.value)
                          }
                          className="w-32 ml-auto"
                        />
                      ) : (
                        `$${itemActual.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        variance < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      ${variance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">
                  ${monthlyBudget.proposedBudget.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${(monthlyBudget.actualBudget || 0).toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right font-semibold ${
                    totalVariance < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  ${totalVariance.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
