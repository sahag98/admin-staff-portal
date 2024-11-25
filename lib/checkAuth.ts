import { QueryCtx } from "@/convex/_generated/server";

export async function GetUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return;
  }
  const user = await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
    .unique();
  if (!user) {
    return;
  }

  return user;
}
