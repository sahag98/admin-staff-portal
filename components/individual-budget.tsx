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
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const calculateVariance = (proposed: number, actual: number): number => {
  return proposed - (actual || 0);
};

function AddBudgetItemDialog({
  userId,
  onClose,
}: {
  userId: Id<"users">;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [budgetNum, setBudgetNum] = useState("");
  const addItem = useMutation(api.users.addBudgetItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem({
        userId,
        title,
        budget_num: parseInt(budgetNum),
      });
      onClose();
    } catch (error) {
      console.error("Failed to add budget item:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Budget Item</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter item title"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Budget Number</label>
          <Input
            type="number"
            value={budgetNum}
            onChange={(e) => setBudgetNum(e.target.value)}
            placeholder="Enter budget number"
            required
          />
        </div>
        <Button type="submit">Add Item</Button>
      </form>
    </DialogContent>
  );
}

function EditBudgetItemDialog({
  userId,
  item,
  onClose,
}: {
  userId: Id<"users">;
  item: { title: string; budget_num: number };
  onClose: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [budgetNum, setBudgetNum] = useState(item.budget_num.toString());
  const editItem = useMutation(api.users.editBudgetItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editItem({
        userId,
        oldBudgetNum: item.budget_num,
        title,
        budget_num: parseInt(budgetNum),
      });
      onClose();
    } catch (error) {
      console.error("Failed to edit budget item:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Budget Item</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter item title"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Budget Number</label>
          <Input
            type="number"
            value={budgetNum}
            onChange={(e) => setBudgetNum(e.target.value)}
            placeholder="Enter budget number"
            required
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </DialogContent>
  );
}

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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const deleteItem = useMutation(api.users.deleteBudgetItem);

  const budgetItems = user?.budgetItems || [];

  const handleDeleteItem = async (budget_num: number) => {
    try {
      await deleteItem({
        userId,
        budget_num,
      });
    } catch (error) {
      console.error("Failed to delete budget item:", error);
    }
  };

  useEffect(() => {
    setEditedBudgets({});
    setIsEditing(false);
  }, [selectedYear, selectedMonth]);

  const monthlyBudget = budget?.monthlyBudgets.find(
    (mb) => mb.month === selectedMonth
  ) || {
    proposedBudget: 0,
    actualBudget: 0,
    itemBudgets: budgetItems.map((item) => ({
      title: item.title,
      proposed: 0,
      actual: 0,
    })),
  };

  const handleSave = async () => {
    const itemBudgets = budgetItems.map((item, index) => {
      const currentEdits = editedBudgets[index];
      const currentBudgetItem = monthlyBudget.itemBudgets?.[index];

      return {
        title: item.title,
        proposed:
          currentEdits?.proposed ??
          currentBudgetItem?.proposed ??
          monthlyBudget.proposedBudget / budgetItems.length,
        actual:
          currentEdits?.actual ??
          currentBudgetItem?.actual ??
          (monthlyBudget.actualBudget || 0) / budgetItems.length,
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
              monthlyBudget.proposedBudget / budgetItems.length,
        actual:
          type === "actual"
            ? numValue
            : prev[itemIndex]?.actual ||
              (monthlyBudget.actualBudget || 0) / budgetItems.length,
      },
    }));
  };

  // Calculate totals
  const totalProposed =
    budgetItems.length * (monthlyBudget.proposedBudget / budgetItems.length);
  const totalActual = monthlyBudget.actualBudget || 0;
  const totalVariance = calculateVariance(totalProposed, totalActual);

  const [editingItem, setEditingItem] = useState<{
    title: string;
    budget_num: number;
  } | null>(null);

  if (!user) return null;

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
          {userInfo?.role === "admin" && (
            <div className="mb-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Budget Item
                  </Button>
                </DialogTrigger>
                <AddBudgetItemDialog
                  userId={userId}
                  onClose={() => setIsAddDialogOpen(false)}
                />
              </Dialog>
            </div>
          )}
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
              {budgetItems.map((item, index) => {
                const budgetItem = monthlyBudget.itemBudgets?.[index] || {
                  title: item.title,
                  po_number: item.budget_num,
                  proposed: monthlyBudget.proposedBudget / budgetItems.length,
                  actual:
                    (monthlyBudget.actualBudget || 0) / budgetItems.length,
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
                    {userInfo?.role === "admin" && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.budget_num)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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
                  ${totalVariance?.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={editingItem !== null}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        {editingItem && (
          <EditBudgetItemDialog
            userId={userId}
            item={editingItem}
            onClose={() => setEditingItem(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
