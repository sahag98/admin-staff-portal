import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { internal } from "./_generated/api";
import { GetUser } from "@/lib/checkAuth";

export const createPO = mutation({
  args: {
    email: v.string(),
    template: v.boolean(),
    template_name: v.string(),
    required_by: v.string(),
    priority: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
    vendor: v.string(),
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
    isBudgeted: v.string(),
    budget_num: v.optional(
      v.object({
        budget_num: v.number(),
        description: v.string(),
      })
    ),
    item_name: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    message: v.optional(v.string()),
    nonbudget_approval: v.optional(v.string()),
    amount: v.number(),
    po_status: v.object({ by: v.string(), status: v.string() }),
    user: v.id("users"),
    fileIds: v.optional(v.array(v.string())),
    fileNames: v.optional(v.array(v.string())),
  },
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (user === null) {
      throw new Error("You are not authorized.");
    } else {
      const {
        amount,
        budget_num,
        template_name,
        template,
        email,
        event_name,
        payment_term,
        expense_type,
        isBudgeted,
        item_name,
        message,
        ministry,
        nonbudget_approval,
        priority,
        required_by,
        po_status,
        user,
        vendor,
        fileIds,
        fileNames,
      } = args;

      const po = await ctx.db.insert("pos", {
        amount,
        budget_num,
        template,
        template_name,
        email,
        event_name,
        payment_term,
        expense_type,
        isBudgeted,
        item_name,
        message,
        ministry,
        nonbudget_approval,
        priority,
        required_by,
        po_status,
        user,
        vendor,
        fileIds: fileIds || [],
        fileNames: fileNames || [],
      });

      return po;
    }
  },
});

export const createPODraft = mutation({
  args: {
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
  },
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (user === null) {
      throw new Error("You are not authorized.");
    } else {
      const {
        amount,
        budget_num,
        template_name,
        template,
        email,
        event_name,
        payment_term,
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
        fileIds,
        fileNames,
      } = args;

      const po = await ctx.db.insert("po_drafts", {
        amount,
        budget_num,
        template,
        template_name,
        email,
        event_name,
        payment_term,
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
        fileIds: fileIds || [],
        fileNames: fileNames || [],
      });

      return po;
    }
  },
});

export const getUserPos = query({
  args: {},
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (!user) {
      return;
    }

    const userPos = await ctx.db
      .query("pos")
      .filter((q) => q.eq(q.field("user"), user._id))
      .order("desc")
      .collect();

    return userPos;
  },
});

export const getUserPODrafts = query({
  args: {},
  async handler(ctx, args) {
    const user = await GetUser(ctx);
    if (!user) {
      return;
    }
    const userPoDrafts = await ctx.db
      .query("po_drafts")
      .filter((q) => q.eq(q.field("user"), user._id))
      .order("desc")
      .collect();

    return userPoDrafts;
  },
});

export const getUserTemplatePos = query({
  args: {},
  async handler(ctx, args) {
    const user = await GetUser(ctx);
    if (!user) {
      return;
    }
    const userTemplatePos = await ctx.db
      .query("pos")
      .filter((q) =>
        q.and(q.eq(q.field("user"), user._id), q.eq(q.field("template"), true))
      )
      .order("desc")
      .collect();

    return userTemplatePos;
  },
});

export const getTemplatePO = query({
  args: { poId: v.optional(v.id("pos")) },
  async handler(ctx, args) {
    if (!args.poId) {
      return;
    }
    await GetUser(ctx);

    const po = await ctx.db.get(args.poId);
    if (!po) {
      throw new Error("Purchase Order not found");
    }

    return po;
  },
});

export const getPODraft = query({
  args: { poDraft_id: v.optional(v.id("po_drafts")) },
  async handler(ctx, args) {
    if (!args.poDraft_id) {
      return;
    }
    await GetUser(ctx);

    const poDraft = await ctx.db.get(args.poDraft_id);
    if (!poDraft) {
      return;
      // throw new Error("Purchase Order draft not found");
    }

    // Only allow access if user is admin or if the PO belongs to the user
    // if (po.user !== user._id) {
    //   throw new Error("Unauthorized access to Purchase Order");
    // }

    return poDraft;
  },
});

export const getPo = query({
  args: { poId: v.id("pos") },
  async handler(ctx, args) {
    await GetUser(ctx);

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
    const user = await GetUser(ctx);

    // Only allow admins to view other users' POs
    if (user?.role !== "admin" && args.user !== user?._id) {
      throw new Error("Unauthorized access to Purchase Orders");
    }

    const userPos = await ctx.db
      .query("pos")
      .filter((q) => q.eq(q.field("user"), args.user))
      .collect();

    return userPos;
  },
});

export const deleteDraft = mutation({
  args: {
    draft_id: v.id("po_drafts"),
  },
  async handler(ctx, args) {
    await GetUser(ctx);

    await ctx.db.delete(args.draft_id);
  },
});

export const deleteTemplate = mutation({
  args: {
    template_id: v.id("pos"),
  },
  async handler(ctx, args) {
    await GetUser(ctx);

    await ctx.db.patch(args.template_id, { template: false });
  },
});

export const updateDraft = mutation({
  args: {
    draft_id: v.id("po_drafts"),
    amount: v.optional(v.number()),
    budget_num: v.optional(
      v.object({
        budget_num: v.number(),
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
    vendor: v.optional(v.string()),
    fileIds: v.optional(v.array(v.string())),
    fileNames: v.optional(v.array(v.string())),
  },
  async handler(ctx, args) {
    await GetUser(ctx);

    const {
      amount,
      budget_num,
      email,
      event_name,
      payment_term,
      expense_type,
      fileIds,
      fileNames,
      isBudgeted,
      item_name,
      message,
      ministry,
      nonbudget_approval,
      priority,
      required_by,
      status,
      template,
      template_name,
      vendor,
    } = args;

    const argsWithoutId = {
      amount,
      budget_num,
      email,
      event_name,
      payment_term,
      expense_type,
      fileIds,
      fileNames,
      isBudgeted,
      item_name,
      message,
      ministry,
      nonbudget_approval,
      priority,
      required_by,
      status,
      template,
      template_name,
      vendor,
    };

    await ctx.db.patch(args.draft_id, argsWithoutId);

    const po = await ctx.db.get(args.draft_id);

    return po;
  },
});

export const updatePOStatus = mutation({
  args: {
    po_id: v.id("pos"),
    status: v.string(),
    user_name: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    // Check if user is admin
    if (user?.role !== "admin") {
      throw new Error(
        "Unauthorized: Only admins can approve/deny purchase orders"
      );
    }

    await ctx.db.patch(args.po_id, {
      po_status: { by: args.user_name, status: args.status },
    });

    const po = await ctx.db.get(args.po_id);

    return po;
  },
});

export const cancelPO = mutation({
  args: { poId: v.id("pos") },
  handler: async (ctx, args) => {
    const user = await GetUser(ctx);

    const po = await ctx.db.get(args.poId);
    if (!po) {
      throw new Error("PO not found");
    }

    // Check if user is the owner or an admin

    // Only allow cancellation if user owns the PO or is an admin
    const isOwner = po.user === user?._id;
    const isAdmin = user?.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new Error("Not authorized to cancel this PO");
    }

    if (po.po_status.status !== "pending") {
      throw new Error("Can only cancel pending POs");
    }

    await ctx.db.delete(args.poId);
  },
});
