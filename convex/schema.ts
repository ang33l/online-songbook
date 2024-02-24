import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  password: defineTable({
    hash: v.string(),
  }),
  path: defineTable({
    link: v.string(),
    label: v.string(),
    user_type: v.id("user_type"),
  }),
  user: defineTable({
    uid: v.string(),
    user_type: v.id("user_type"),
  }),
  user_type: defineTable({
    label: v.string(),
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
