import { v } from "convex/values";
import { action } from "./_generated/server";
import { mutation } from "./_generated/server";
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

// export const uploadFile = mutation({
//   args: {
//     fileName: v.string(),
//     fileData: v.string(), // Assuming base64 or some form of file data
//   },
//   async handler(ctx, args) {
//     const { fileName, fileData } = args;

//     // Logic to store the file and get a storage ID
//     const storageId = await ctx.storage.put(fileData);

//     return { storageId, fileName };
//   },
// });
