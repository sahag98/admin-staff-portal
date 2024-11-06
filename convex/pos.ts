import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { internal } from "./_generated/api";

export const createPO = mutation({
  args: {
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
    message: v.optional(v.string()),
    nonbudget_approval: v.optional(v.string()),
    amount: v.number(),
    status: v.string(),
    user: v.id("users"),
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    if (user === null) {
      throw new Error("You are not authorized.");
    } else {
      // const newBudget = user.budget - args.amount;

      // await ctx.db.patch(user._id, { budget: newBudget });
      const {
        amount,
        budget_num,
        email,
        event_name,
        expense_type,
        isBudgeted,
        item_name,
        message,
        ministry,
        nonbudget_approval,
        priority,
        required_by,
        status,
        user,
        vendor,
        fileId,
        fileName,
      } = args;

      const po = await ctx.db.insert("pos", {
        amount,
        budget_num,
        email,
        event_name,
        expense_type,
        isBudgeted,
        item_name,
        message,
        ministry,
        nonbudget_approval,
        priority,
        required_by,
        status,
        user,
        vendor,
        fileId,
        fileName,
      });

      return po;
    }
  },
});

export const getUserPos = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    console.log("identity: ", identity);
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    const userPos = await ctx.db
      .query("pos")
      .filter((q) => q.eq(q.field("user"), user._id))
      .collect();

    return userPos;
  },
});

export const getPo = query({
  args: { poId: v.id("pos") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to query");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to query");
    }

    const po = await ctx.db.get(args.poId);
    if (!po) {
      throw new Error("Purchase Order not found");
    }

    // Only allow access if user is admin or if the PO belongs to the user
    // if (po.user !== user._id) {
    //   throw new Error("Unauthorized access to Purchase Order");
    // }

    return po;
  },
});

export const getUserPosById = query({
  args: { user: v.id("users") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to query");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to query");
    }

    // Only allow admins to view other users' POs
    if (user.role !== "admin" && args.user !== user._id) {
      throw new Error("Unauthorized access to Purchase Orders");
    }

    const userPos = await ctx.db
      .query("pos")
      .filter((q) => q.eq(q.field("user"), args.user))
      .collect();

    return userPos;
  },
});

export const updatePOStatus = mutation({
  args: {
    po_id: v.id("pos"),
    status: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    // Check if user is admin
    if (user.role !== "admin") {
      throw new Error(
        "Unauthorized: Only admins can approve/deny purchase orders"
      );
    }

    await ctx.db.patch(args.po_id, { status: args.status });

    const po = await ctx.db.get(args.po_id);

    return po;
  },
});
