import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  resource: defineTable({
    title: v.string(),
    type: v.string(),
    fileIds: v.array(v.string()),
    fileNames: v.array(v.string()),
  }),
  po_drafts: defineTable({
    amount: v.optional(v.number()),
    budget_num: v.optional(
      v.object({
        budget_num: v.number(),
        category: v.optional(v.string()),
        initials: v.optional(v.string()),
        section: v.optional(v.string()),
        description: v.string(),
      })
    ),
    template: v.optional(v.boolean()),
    template_name: v.optional(v.string()),
    email: v.optional(v.string()),
    event_name: v.optional(
      v.union(
        v.literal("Gala"),
        v.literal("Easter"),
        v.literal("Team Night"),
        v.literal("Flourish"),
        v.literal("First Responders Day"),
        v.literal("Forged Men's Night"),
        v.literal("NL Kids Blast"),
        v.literal("Junior Camp"),
        v.literal("Teen Camp"),
        v.literal("Educator Appreciation Day"),
        v.literal("Mother's Day/Parent & Child Dedications"),
        v.literal("Freedom Sunday"),
        v.literal("Men's Camp"),
        v.literal("NL Girls: Bloom"),
        v.literal("Family Conference"),
        v.literal("YA Conference"),
        v.literal("NL Marriage Retreat"),
        v.literal("Pumpkin Patch"),
        v.literal("Trunk or Treat"),
        v.literal("World Outreach Sunday"),
        v.literal("Walkthrough Bethlehem"),
        v.literal("New Life Christmas Experience"),
        v.literal("Not Related to Any Events")
      )
    ),
    payment_term: v.optional(
      v.union(
        v.literal("Check in Advance"),
        v.literal("Check on Delivery"),
        v.literal("Ministry Credit Card"),
        v.literal("Reimbursement")
      )
    ),
    expense_type: v.optional(
      v.union(
        v.literal("General"),
        v.literal("Building"),
        v.literal("Missions")
      )
    ),
    isBudgeted: v.optional(v.string()),
    item_name: v.optional(
      v.array(
        v.object({
          name: v.string(),
          quantity: v.number(),
          price: v.number(),
        })
      )
    ),
    message: v.optional(v.string()),
    ministry: v.optional(
      v.union(
        v.literal("Assimilation/Guest Experience"),
        v.literal("Refreshment Cart"),
        v.literal("Media and Production"),
        v.literal("Worship Team"),
        v.literal("NLK"),
        v.literal("NLY"),
        v.literal("NLYA"),
        v.literal("Life Groups"),
        v.literal("Facilities"),
        v.literal("Grief and Care"),
        v.literal("Hospitality"),
        v.literal("Counselling"),
        v.literal("Benevolence"),
        v.literal("Outreach/Discipleship"),
        v.literal("Volunteers"),
        v.literal("Admin Expense: Meals/Gas/Supplies/Office")
      )
    ),
    nonbudget_approval: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
    required_by: v.optional(v.string()),
    status: v.optional(v.string()),
    user: v.id("users"),
    vendor: v.optional(v.string()),
    fileIds: v.optional(v.array(v.string())),
    fileNames: v.optional(v.array(v.string())),
  }),
  pos: defineTable({
    amount: v.number(),
    is_reconciled: v.optional(v.boolean()),
    budget_num: v.optional(
      v.object({
        budget_num: v.number(),
        description: v.string(),
      })
    ),
    reason: v.optional(v.string()),
    template: v.boolean(),
    template_name: v.string(),
    email: v.string(),
    event_name: v.union(
      v.literal("Gala"),
      v.literal("Easter"),
      v.literal("Team Night"),
      v.literal("Flourish"),
      v.literal("First Responders Day"),
      v.literal("Forged Men's Night"),
      v.literal("NL Kids Blast"),
      v.literal("Junior Camp"),
      v.literal("Teen Camp"),
      v.literal("Educator Appreciation Day"),
      v.literal("Mother's Day/Parent & Child Dedications"),
      v.literal("Freedom Sunday"),
      v.literal("Men's Camp"),
      v.literal("NL Girls: Bloom"),
      v.literal("Family Conference"),
      v.literal("YA Conference"),
      v.literal("NL Marriage Retreat"),
      v.literal("Pumpkin Patch"),
      v.literal("Trunk or Treat"),
      v.literal("World Outreach Sunday"),
      v.literal("Walkthrough Bethlehem"),
      v.literal("New Life Christmas Experience"),
      v.literal("Not Related to Any Events")
    ),
    payment_term: v.union(
      v.literal("Check in Advance"),
      v.literal("Check on Delivery"),
      v.literal("Ministry Credit Card"),
      v.literal("Reimbursement")
    ),
    expense_type: v.union(
      v.literal("General"),
      v.literal("Building"),
      v.literal("Missions")
    ),
    isBudgeted: v.string(),
    item_name: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    message: v.optional(v.string()),
    ministry: v.union(
      v.literal("Assimilation/Guest Experience"),
      v.literal("Refreshment Cart"),
      v.literal("Media and Production"),
      v.literal("Worship Team"),
      v.literal("NLK"),
      v.literal("NLY"),
      v.literal("NLYA"),
      v.literal("Life Groups"),
      v.literal("Facilities"),
      v.literal("Grief and Care"),
      v.literal("Hospitality"),
      v.literal("Counselling"),
      v.literal("Benevolence"),
      v.literal("Outreach/Discipleship"),
      v.literal("Volunteers"),
      v.literal("Admin Expense: Meals/Gas/Supplies/Office")
    ),
    nonbudget_approval: v.optional(v.string()),
    priority: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
    required_by: v.string(),
    po_status: v.object({ by: v.optional(v.string()), status: v.string() }),
    user: v.id("users"),
    vendor: v.string(),
    fileIds: v.array(v.string()),
    fileNames: v.array(v.string()),
  }),
  users: defineTable({
    name: v.string(),
    budget: v.number(),
    role: v.string(),
    po_nums: v.array(
      v.object({
        category: v.string(),
        section: v.string(),
        description: v.string(),
        initials: v.string(),
        budget_num: v.number(),
      })
    ),
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
