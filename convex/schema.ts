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
    budget_num: v.number(),
    item_name: v.string(),
    nonbudget_approval: v.optional(v.string()),
    amount: v.number(),
    status: v.string(),
    message: v.string(),
    user: v.id("users"),
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
  }),
  users: defineTable({
    name: v.string(),
    budget: v.number(),
    role: v.string(),
    po_nums: v.array(v.number()),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
