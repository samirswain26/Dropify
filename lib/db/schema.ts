import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files =  pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    name: text("name").notNull(),
    path: text("path").notNull(), // accurate path of the file eg. /document/class/topic1
    size:text("size").notNull(),
    type: text("type").notNull(), 

    filrUrl: text("file_url").notNull(), // acces url for the file
    thumbnailUrl: text("thumbnail_url"),

    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"), // Parent folder id (null if it was the root user)

    isFolder: boolean("is_Folder").notNull().default(false),
    isStarred: boolean("is_starred").notNull().default(false),
    isTrash: boolean("is_Trash").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const fileRelations = relations(files, ({one, many}) => ({
    // Relationship to parent
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id]
    }),

    // Relationship to the children
    child: many(files)
}))

// Type defination for typescript

export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert