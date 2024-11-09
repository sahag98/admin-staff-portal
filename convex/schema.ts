import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pos: defineTable({
    email: v.string(),
    required_by: v.string(),
    priority: v.string(),
    vendor: v.string(),
    expense_type: v.string(),
    event_name: v.string(),
    ministry: v.string(),
    isBudgeted: v.string(),
    budget_num: v.optional(v.number()),
    item_name: v.string(),
    nonbudget_approval: v.optional(v.string()),
    amount: v.number(),
    status: v.string(),
    message: v.optional(v.string()),
    user: v.id("users"),
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
  }),
  users: defineTable({
    name: v.string(),
    budget: v.number(),
    role: v.string(),
    po_nums: v.array(v.number()),
    budgetItems: v.optional(
      v.array(
        v.object({
          title: v.string(),
          budget_num: v.number(),
        })
      )
    ),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
  budgets: defineTable({
    userId: v.id("users"),
    year: v.number(),
    monthlyBudgets: v.array(
      v.object({
        month: v.string(),
        proposedBudget: v.number(),
        actualBudget: v.optional(v.number()),
        itemBudgets: v.optional(
          v.array(
            v.object({
              title: v.string(),
              proposed: v.number(),
              actual: v.optional(v.number()),
            })
          )
        ),
      })
    ),
  }).index("by_user_year", ["userId", "year"]),
});
