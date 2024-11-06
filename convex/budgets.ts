import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define mockBudgetItems to match the ones in individual-budget.tsx
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

export const save = mutation({
  args: {
    year: v.number(),
    monthlyBudgets: v.array(
      v.object({
        month: v.string(),
        proposedBudget: v.number(),
        actualBudget: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if a budget already exists for this year
    const existingBudget = await ctx.db
      .query("budgets")
      .withIndex("by_user_year", (q) =>
        q.eq("userId", user._id).eq("year", args.year)
      )
      .first();

    if (existingBudget) {
      // Update existing budget
      await ctx.db.patch(existingBudget._id, {
        monthlyBudgets: args.monthlyBudgets,
      });
    } else {
      // Create new budget
      await ctx.db.insert("budgets", {
        userId: user._id,
        year: args.year,
        monthlyBudgets: args.monthlyBudgets,
      });
    }
  },
});

export const getBudgetByYear = query({
  args: {
    year: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the current user to check admin status
    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }

    // If not admin and trying to view someone else's budget, throw error
    if (currentUser.role !== "admin" && args.userId !== currentUser._id) {
      throw new Error(
        "Unauthorized: Only admins can view other users' budgets"
      );
    }

    // Return the requested user's budget
    return ctx.db
      .query("budgets")
      .withIndex("by_user_year", (q) =>
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .first();
  },
});

export const updateActualBudget = mutation({
  args: {
    year: v.number(),
    month: v.string(),
    actualBudget: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await ctx.db
      .query("budgets")
      .withIndex("by_user_year", (q) =>
        q.eq("userId", user._id).eq("year", args.year)
      )
      .first();

    if (!budget) {
      throw new Error("Budget not found");
    }

    const updatedMonthlyBudgets = budget.monthlyBudgets.map((mb) =>
      mb.month === args.month ? { ...mb, actualBudget: args.actualBudget } : mb
    );

    await ctx.db.patch(budget._id, {
      monthlyBudgets: updatedMonthlyBudgets,
    });
  },
});

export const updateBudgetItem = mutation({
  args: {
    userId: v.id("users"),
    year: v.number(),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify admin status
    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update budgets");
    }

    const budget = await ctx.db
      .query("budgets")
      .withIndex("by_user_year", (q) =>
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .first();

    const newMonthlyBudget = {
      month: args.month,
      proposedBudget: args.proposedBudget,
      actualBudget: args.actualBudget,
      itemBudgets:
        args.itemBudgets ||
        mockBudgetItems.map((item) => ({
          title: item.title,
          proposed: args.proposedBudget / mockBudgetItems.length,
          actual: args.actualBudget
            ? args.actualBudget / mockBudgetItems.length
            : undefined,
        })),
    };

    if (!budget) {
      // Create new budget if it doesn't exist
      await ctx.db.insert("budgets", {
        userId: args.userId,
        year: args.year,
        monthlyBudgets: [newMonthlyBudget],
      });
      return;
    }

    // Update existing budget
    const updatedMonthlyBudgets = [...budget.monthlyBudgets];
    const monthIndex = updatedMonthlyBudgets.findIndex(
      (mb) => mb.month === args.month
    );

    if (monthIndex === -1) {
      updatedMonthlyBudgets.push(newMonthlyBudget);
    } else {
      updatedMonthlyBudgets[monthIndex] = newMonthlyBudget;
    }

    await ctx.db.patch(budget._id, {
      monthlyBudgets: updatedMonthlyBudgets,
    });
  },
});
