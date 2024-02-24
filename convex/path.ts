import { v } from "convex/values";
import { query } from "./_generated/server";

export const getPaths = query({
  args: { user_id: v.optional(v.string()) },
  handler: async ({ db }, { user_id }) => {
    const userTypes = await db.query("user_type").collect();
    let admin: string, headAdmin: string, _user: string;
    for (const userType of userTypes) {
      if (userType.label === "admin") {
        admin = userType._id;
      } else if (userType.label === "head_admin") {
        headAdmin = userType._id;
      } else if (userType.label === "user") {
        _user = userType._id;
      }
    }
    if (user_id === undefined) {
      return await db
        .query("path")
        .filter((q) => q.eq(q.field("user_type"), _user))
        .collect();
    }
    const user = await db
      .query("user")
      .filter((q) => q.eq(q.field("uid"), user_id))
      .collect();
    if (user.length === 0) {
      return await db
        .query("path")
        .filter((q) => q.eq(q.field("user_type"), _user))
        .collect();
    }
    if (user[0].user_type === headAdmin!) {
      return await db.query("path").collect();
    } else if (user[0].user_type === admin!) {
      return await db
        .query("path")
        .filter((q) =>
          q.or(
            q.eq(q.field("user_type"), _user),
            q.eq(q.field("user_type"), admin)
          )
        )
        .collect();
    }
  },
});
