import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Resend } from "resend";
import { internal } from "./_generated/api";
import { GetUser } from "@/lib/checkAuth";

export const createResource = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    fileIds: v.array(v.string()),
    fileNames: v.array(v.string()),
  },
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (user === null) {
      throw new Error("You are not authorized.");
    } else {
      const { title, type, fileIds, fileNames } = args;

      const resource = await ctx.db.insert("resource", {
        title,
        type,
        fileIds,
        fileNames,
      });

      return resource;
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

export const getResource = query({
  args: { resourceId: v.id("resource") },
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (!user) {
      return;
    }

    const resource = await ctx.db
      .query("resource")
      .filter((q) => q.eq(q.field("_id"), args.resourceId))
      .order("desc")
      .first();

    return resource;
  },
});

export const getPolicies = query({
  args: {},
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (!user) {
      return;
    }

    const policies = await ctx.db
      .query("resource")
      .filter((q) => q.eq(q.field("type"), "policy"))
      .order("desc")
      .collect();

    return policies;
  },
});

export const getProcedures = query({
  args: {},
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (!user) {
      return;
    }

    const procedures = await ctx.db
      .query("resource")
      .filter((q) => q.eq(q.field("type"), "procedure"))
      .order("desc")
      .collect();

    return procedures;
  },
});

export const getInformations = query({
  args: {},
  async handler(ctx, args) {
    const user = await GetUser(ctx);

    if (!user) {
      return;
    }

    const information = await ctx.db
      .query("resource")
      .filter((q) => q.eq(q.field("type"), "information"))
      .order("desc")
      .collect();

    return information;
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

export const deleteFileFromResource = mutation({
  args: {
    resourceId: v.id("resource"),
    fileId: v.string(),
  },
  async handler(ctx, args) {
    const { resourceId, fileId } = args;
    const resource = await ctx.db.get(resourceId);
    if (!resource) {
      throw new Error("Resource not found");
    }

    // Remove the fileId and corresponding fileName
    const fileIndex = resource.fileIds.indexOf(fileId);
    if (fileIndex === -1) {
      throw new Error("File not found in resource");
    }

    const updatedFileIds = resource.fileIds.filter((id) => id !== fileId);
    const updatedFileNames = resource.fileNames.filter(
      (_, index) => index !== fileIndex
    );

    await ctx.db.patch(resourceId, {
      fileIds: updatedFileIds,
      fileNames: updatedFileNames,
    });
  },
});

export const addFilesToResource = mutation({
  args: {
    resourceId: v.id("resource"),
    fileIds: v.array(v.string()),
    fileNames: v.array(v.string()),
  },
  async handler(ctx, args) {
    const { resourceId, fileIds, fileNames } = args;
    console.log("args: ", args);
    const resource = await ctx.db.get(resourceId);
    if (!resource) {
      throw new Error("Resource not found");
    }

    await ctx.db.patch(resourceId, {
      fileIds: [...resource.fileIds, ...fileIds],
      fileNames: [...resource.fileNames, ...fileNames],
    });
  },
});
