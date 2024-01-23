import { v } from "convex/values";
import { query } from "./_generated/server";

export const isAdmin = query({
  args: { user_id: v.string() },
  handler: async ({ db }, { user_id }) => {
    const user = await db
      .query("user")
      .filter((q) => q.eq(q.field("uid"), user_id))
      .collect();
    if (user.length === 0) {
      return false;
    }
    return user[0].admin;
  },
});
