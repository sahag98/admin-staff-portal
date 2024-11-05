import { internalMutation, query, QueryCtx } from "./_generated/server";
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
