import { v } from "convex/values";
import { query } from "./_generated/server";

export const verifyPassword = query({
  args: { password: v.string() },
  handler: async ({ db }, { password }) => {
    const hash = await db
      .query("password")
      .filter((q) => q.eq(q.field("hash"), password))
      .collect();
    if (hash.length > 0) {
      return true;
    } else {
      return false;
    }
  },
});
