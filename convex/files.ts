import { v } from "convex/values";
import { action } from "./_generated/server";
// import { StorageId } from "./_generated/dataModel";

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to action");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = action({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
