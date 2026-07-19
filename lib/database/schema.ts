import {
    pgTable,
    uuid,
    text,
    bigint,
    timestamp,
    pgEnum,
    integer,
} from "drizzle-orm/pg-core";

import { defineRelations } from "drizzle-orm";

export const providerEnum = pgEnum("provider", [
    "github",
    "google",
]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    provider: providerEnum("provider").notNull(), // github | google
    ip: text("ip").notNull(),
    credits: integer("credits").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const repositories = pgTable("repositories", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => users.id)
        .notNull(),
    githubRepoId: bigint("github_repo_id", {
        mode: "number",
    }).notNull(),
    repoUrl: text("repo_url").notNull(),
    token: text("token").notNull(),
    owner: text("owner").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const releaseDrafts = pgTable("release_drafts", {
    id: uuid("id").defaultRandom().primaryKey(),
    repositoryId: uuid("repository_id")
        .references(() => repositories.id)
        .notNull(),
    fromTag: text("from_tag").notNull(),
    toTag: text("to_tag").notNull(),
    markdown: text("markdown").notNull(),
    status: text("status").default("draft").notNull(), // draft | published
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const releases = pgTable("releases", {
    id: uuid("id").defaultRandom().primaryKey(),
    draftId: uuid("draft_id")
        .references(() => releaseDrafts.id)
        .notNull(),
    githubReleaseId: bigint("github_release_id", {
        mode: "number",
    }).notNull(),
    releaseUrl: text("release_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const relations = defineRelations(
    {
        users,
        repositories,
        releaseDrafts,
        releases,
    },
    (r) => ({
        repositories: {
            user: r.one.users({
                from: r.repositories.userId,
                to: r.users.id,
            }),
        },

        releaseDrafts: {
            repository: r.one.repositories({
                from: r.releaseDrafts.repositoryId,
                to: r.repositories.id,
            }),
        },

        releases: {
            draft: r.one.releaseDrafts({
                from: r.releases.draftId,
                to: r.releaseDrafts.id,
            }),
        },
    }),
);

export const User = typeof users.$inferSelect;
export const Repository = typeof repositories.$inferSelect;
export const ReleaseDraft = typeof releaseDrafts.$inferSelect;
export const Release = typeof releases.$inferSelect;

export const NewUser = typeof users.$inferInsert;
export const NewRepository = typeof repositories.$inferInsert;
export const NewReleaseDraft = typeof releaseDrafts.$inferInsert;
export const NewRelease = typeof releases.$inferInsert;