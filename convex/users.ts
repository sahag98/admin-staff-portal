import {
  internalMutation,
  query,
  QueryCtx,
  mutation,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      budget: 500,
      role: "user",
      po_nums: [],
      externalId: data.id,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const getAllShareUsers = query({
  args: {},
  async handler(ctx) {
    console.log("here");
    // Get the authenticated user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to query");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // If user is admin, return all users
    const allUsers = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("externalId"), identity.subject))
      .collect();

    return allUsers;
  },
});

export const getAllUsers = query({
  args: {},
  async handler(ctx) {
    console.log("here");
    // Get the authenticated user's identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to query");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can view all users");
    }

    // If user is admin, return all users
    const allUsers = await ctx.db.query("users").collect();

    console.log("all convex: ", allUsers);
    return allUsers;
  },
});

export const getUserByName = query({
  args: { name: v.string() },
  async handler(ctx, { name }) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), name))
      .unique();

    if (!user) {
      throw new Error(`User not found with name: ${name}`);
    }

    return user;
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }

    return user;
  },
});

// export const getUser = query({
//   args: { userId: v.string() },
//   handler: async (ctx, args) => {
//     const user = await ctx.db.get(args.userId);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     return user;
//   },
// });

export const addBudgetItem = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    budget_num: v.number(),
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
      throw new Error("Unauthorized: Only admins can manage budget items");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const budgetItems = user.budgetItems || [];

    // Check if budget_num already exists
    if (budgetItems.some((item) => item.budget_num === args.budget_num)) {
      throw new Error("Budget number already exists");
    }

    await ctx.db.patch(args.userId, {
      budgetItems: [
        ...budgetItems,
        { title: args.title, budget_num: args.budget_num },
      ],
      po_nums: [...(user.po_nums || []), args.budget_num],
    });
  },
});

export const deleteBudgetItem = mutation({
  args: {
    userId: v.id("users"),
    budget_num: v.number(),
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
      throw new Error("Unauthorized: Only admins can manage budget items");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const budgetItems = user.budgetItems || [];
    const updatedBudgetItems = budgetItems.filter(
      (item) => item.budget_num !== args.budget_num
    );

    const updatedPoNums = (user.po_nums || []).filter(
      (num) => num !== args.budget_num
    );

    await ctx.db.patch(args.userId, {
      budgetItems: updatedBudgetItems,
      po_nums: updatedPoNums,
    });
  },
});

export const editBudgetItem = mutation({
  args: {
    userId: v.id("users"),
    oldBudgetNum: v.number(),
    title: v.string(),
    budget_num: v.number(),
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
      throw new Error("Unauthorized: Only admins can manage budget items");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const budgetItems = user.budgetItems || [];

    // Check if new budget_num already exists (except for the item being edited)
    if (
      args.oldBudgetNum !== args.budget_num &&
      budgetItems.some((item) => item.budget_num === args.budget_num)
    ) {
      throw new Error("Budget number already exists");
    }

    // Update the budget item
    const updatedBudgetItems = budgetItems.map((item) =>
      item.budget_num === args.oldBudgetNum
        ? { title: args.title, budget_num: args.budget_num }
        : item
    );

    // Update po_nums array
    const updatedPoNums = user.po_nums.map((num) =>
      num === args.oldBudgetNum ? args.budget_num : num
    );

    await ctx.db.patch(args.userId, {
      budgetItems: updatedBudgetItems,
      po_nums: updatedPoNums,
    });
  },
});
