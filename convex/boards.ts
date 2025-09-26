import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (args.favorites) {
      const favoriteBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (query) =>
          query.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoriteBoards.map((board) => board.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => ({ ...board, isFavorite: true }));
    }

    const boards = args.search
      ? await ctx.db
          .query("boards")
          .withSearchIndex("search_title", (query) =>
            query.search("title", args.search!).eq("orgId", args.orgId)
          )
          .collect()
      : await ctx.db
          .query("boards")
          .withIndex("by_org", (query) => query.eq("orgId", args.orgId))
          .order("desc")
          .collect();

    const boardsWithFavoriteRelation = boards.map((board) =>
      ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (query) =>
          query.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => ({ ...board, isFavorite: !!favorite }))
    );

    return Promise.all(boardsWithFavoriteRelation);
  },
});
