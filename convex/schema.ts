import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  password: defineTable({
    hash: v.string(),
  }),
  path: defineTable({
    link: v.string(),
    label: v.string(),
    admin: v.boolean(),
  }),
  user: defineTable({
    uid: v.string(),
    admin: v.boolean(),
  }),
  song: defineTable({
    title: v.string(),
    text: v.string(),
    category: v.id("category"),
  }).searchIndex("search_title", { searchField: "title" }),
  category: defineTable({
    label: v.string(),
  }),
});
