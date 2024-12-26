import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import dayjs from "dayjs";

export const todosTable = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  completed: integer("completed", {
    mode: "boolean",
  }),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).$defaultFn(() => dayjs().toDate()),
  updatedAt: integer("createdAt", {
    mode: "timestamp",
  })
    .$defaultFn(() => dayjs().toDate())
    .$onUpdateFn(() => dayjs().toDate()),
});

export const boardgames = sqliteTable("boardgames", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  originalName: text("originalName").notNull(),
  ownerId: text("ownerId"),
  imported: integer("imported", { mode: "boolean" }).notNull().default(false),
  bggId: text("bggId"),
  weight: real("weight"),
  bestWith: text("bestWith"),
  recommendedWith: text("recommendedWith"),
  minPlayers: integer("minPlayers"),
  maxPlayers: integer("maxPlayers"),
  thumbnailUrl: text("thumbnailUrl"),
  imageUrl: text("imageUrl"),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).$defaultFn(() => dayjs().toDate()),
});
