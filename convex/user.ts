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
    const adminId = await db
      .query("user_type")
      .filter((q) =>
        q.or(
          q.eq(q.field("label"), "admin"),
          q.eq(q.field("label"), "head_admin")
        )
      )
      .collect();
    return (
      user[0].user_type === adminId[0]._id ||
      user[0].user_type === adminId[1]._id
    );
  },
});

export const isHeadAdmin = query({
  args: { user_id: v.string() },
  handler: async ({ db }, { user_id }) => {
    const user = await db
      .query("user")
      .filter((q) => q.eq(q.field("uid"), user_id))
      .collect();
    if (user.length === 0) {
      return false;
    }
    const adminId = await db
      .query("user_type")
      .filter((q) => q.eq(q.field("label"), "head_admin"))
      .collect();
    return user[0].user_type === adminId[0]._id;
  },
});
