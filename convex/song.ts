import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
  handler: async ({ db }) => {
    return db.query("category").collect();
  },
});
export const getSongsWithFilter = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filter: v.string(),
    category: v.string(),
  },
  handler: async (ctx, { paginationOpts, filter, category }) => {
    if (category.length > 0 && filter.length > 0) {
      return await ctx.db
        .query("song")
        .withSearchIndex("search_title", (q) => q.search("title", filter))
        .filter((q) => q.eq(q.field("category"), category))
        .paginate(paginationOpts);
    } else if (category.length > 0 && filter.length === 0) {
      return await ctx.db
        .query("song")
        .filter((q) => q.eq(q.field("category"), category))
        .paginate(paginationOpts);
    } else if (category.length === 0 && filter.length > 0) {
      return await ctx.db
        .query("song")
        .withSearchIndex("search_title", (q) => q.search("title", filter))
        .paginate(paginationOpts);
    } else {
      return await ctx.db.query("song").paginate(paginationOpts);
    }
  },
});

export const getSong = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    return await db
      .query("song")
      .filter((q) => q.eq(q.field("_id"), id))
      .collect();
  },
});

export const addSingleSong = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    text: v.string(),
  },
  handler: async ({ db }, { title, category, text }) => {
    const dbCategory = await db
      .query("category")
      .filter((q) => q.eq(q.field("_id"), category))
      .collect();
    if (!dbCategory[0]) return false;
    return await db.insert("song", {
      title,
      category: dbCategory[0]._id,
      text,
    });
  },
});

export const addCategory = mutation({
  args: { name: v.string() },
  handler: async ({ db }, { name }) => {
    const category = await db
      .query("category")
      .filter((q) => q.eq(q.field("label"), name))
      .collect();
    if (category.length > 0) {
      return false;
    } else {
      return await db.insert("category", { label: name });
    }
  },
});
