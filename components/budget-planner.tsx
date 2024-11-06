// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "./ui/button";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// // import { toast } from "react-hot-toast";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface MonthlyBudget {
//   month: string;
//   proposedBudget: number;
//   actualBudget?: number;
// }

// interface BudgetInput {
//   [key: string]: string;
// }

// export default function BudgetPlanner() {
//   const [budgets, setBudgets] = useState<BudgetInput>({});
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const saveBudget = useMutation(api.budgets.save);
//   const updateActual = useMutation(api.budgets.updateActualBudget);
//   const existingBudget = useQuery(api.budgets.getBudgetByYear, {
//     year: selectedYear,
//   });

//   const years = Array.from(
//     { length: 5 },
//     (_, i) => new Date().getFullYear() - 2 + i
//   );

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   useEffect(() => {
//     if (existingBudget) {
//       const budgetMap: BudgetInput = {};
//       existingBudget.monthlyBudgets?.forEach((mb) => {
//         budgetMap[mb.month] = mb.proposedBudget.toString();
//       });
//       setBudgets(budgetMap);
//     }
//   }, [existingBudget]);

//   const handleBudgetChange = (month: string, value: string) => {
//     if (value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
//       setBudgets((prev) => ({ ...prev, [month]: value }));
//     }
//   };

//   const handleActualBudgetUpdate = async (month: string, value: string) => {
//     try {
//       await updateActual({
//         year: selectedYear,
//         month,
//         actualBudget: parseFloat(value),
//       });
//       //   toast.success(`Updated actual budget for ${month}`);
//     } catch (error) {
//       //   toast.error("Failed to update actual budget");
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       // Validate all numbers
//       const monthlyBudgets: MonthlyBudget[] = months.map((month) => {
//         const value = parseFloat(budgets[month] || "0");
//         if (isNaN(value) || value < 0) {
//           throw new Error(`Invalid budget for ${month}`);
//         }
//         return {
//           month,
//           proposedBudget: value,
//         };
//       });

//       await saveBudget({
//         year: selectedYear,
//         monthlyBudgets,
//       });

//       //   toast.success("Budget saved successfully!");
//     } catch (error) {
//       //   toast.error(
//       //     error instanceof Error ? error.message : "Failed to save budget"
//       //   );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const total = Object.values(budgets).reduce(
//     (sum, value) => sum + (parseFloat(value) || 0),
//     0
//   );

//   const actualTotal =
//     existingBudget?.monthlyBudgets.reduce(
//       (sum, mb) => sum + (mb.actualBudget || 0),
//       0
//     ) || 0;

//   return (
//     <div className="min-h-screen p-8">
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-3xl font-bold">
//               Yearly Budget Planner
//             </CardTitle>
//             <Select
//               value={selectedYear.toString()}
//               onValueChange={(value) => setSelectedYear(parseInt(value))}
//             >
//               <SelectTrigger className="w-32">
//                 <SelectValue placeholder="Select Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {years.map((year) => (
//                   <SelectItem key={year} value={year.toString()}>
//                     {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {months.map((month) => (
//               <div key={month} className="space-y-2">
//                 <Label htmlFor={month}>{month}</Label>
//                 <div className="space-y-2">
//                   <Input
//                     id={`${month}-proposed`}
//                     type="number"
//                     placeholder="Proposed budget"
//                     value={budgets[month] || ""}
//                     onChange={(e) => handleBudgetChange(month, e.target.value)}
//                     className="w-full"
//                     disabled={!isEditing}
//                   />
//                   {existingBudget && (
//                     <Input
//                       id={`${month}-actual`}
//                       type="number"
//                       placeholder="Actual spent"
//                       defaultValue={
//                         existingBudget.monthlyBudgets.find(
//                           (mb) => mb.month === month
//                         )?.actualBudget
//                       }
//                       onBlur={(e) =>
//                         handleActualBudgetUpdate(month, e.target.value)
//                       }
//                       className="w-full"
//                     />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 space-y-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-semibold">Proposed Total</h2>
//                 <p className="text-3xl font-bold text-green-600">
//                   {new Intl.NumberFormat("en-US", {
//                     style: "currency",
//                     currency: "USD",
//                   }).format(total)}
//                 </p>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-semibold">Actual Total</h2>
//                 <p className="text-3xl font-bold text-blue-600">
//                   {new Intl.NumberFormat("en-US", {
//                     style: "currency",
//                     currency: "USD",
//                   }).format(actualTotal)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-end gap-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsEditing(!isEditing)}
//               >
//                 {isEditing ? "Cancel" : "Edit"}
//               </Button>
//               <Button onClick={handleSubmit} disabled={loading || !isEditing}>
//                 {loading ? "Saving..." : "Save Budget"}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
