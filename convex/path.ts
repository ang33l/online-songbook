import { v } from "convex/values";
import { query } from "./_generated/server";

export const getPaths = query({
  args: { user_id: v.optional(v.string()) },
  handler: async ({ db }, { user_id }) => {
    if (user_id === undefined) {
      return await db
        .query("path")
        .filter((q) => q.eq(q.field("admin"), false))
        .collect();
    }
    const user = await db
      .query("user")
      .filter((q) => q.eq(q.field("uid"), user_id))
      .collect();
    if (user.length === 0) {
      return await db
        .query("path")
        .filter((q) => q.eq(q.field("admin"), false))
        .collect();
    }
    if (user[0].admin === true) {
      return await db.query("path").collect();
    } else {
      return await db
        .query("path")
        .filter((q) => q.eq(q.field("admin"), false))
        .collect();
    }
  },
});
