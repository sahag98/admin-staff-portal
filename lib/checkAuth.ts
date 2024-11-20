import { QueryCtx } from "@/convex/_generated/server";

export async function GetUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated call to mutation");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
    .unique();
  if (!user) {
    throw new Error("Unauthenticated user call");
  }

  return user;
}
