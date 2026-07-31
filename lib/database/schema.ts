import {
  pgTable,
  uuid,
  text,
  bigint,
  timestamp,
  pgEnum,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

import { defineRelations } from 'drizzle-orm';

export const PROVIDERS = ['github', 'google'] as const;
export const providerEnum = pgEnum('provider', PROVIDERS);

export const ROLES = ['user', 'admin', 'superadmin'] as const;
export const roleEnum = pgEnum('role', ROLES);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  provider: providerEnum('provider').notNull(), // github | google
  role: roleEnum('role').default('user').notNull(),
  ip: text('ip').notNull(),
  credits: integer('credits').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const repositories = pgTable('repositories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  githubRepoId: bigint('github_repo_id', {
    mode: 'number',
  }).notNull(),
  repoUrl: text('repo_url').notNull(),
  token: text('token').notNull(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const releaseDrafts = pgTable('release_drafts', {
  id: uuid('id').defaultRandom().primaryKey(),
  repositoryId: uuid('repository_id')
    .references(() => repositories.id)
    .notNull(),
  fromTag: text('from_tag').notNull(),
  toTag: text('to_tag').notNull(),
  markdown: text('markdown').notNull(),
  status: text('status').default('draft').notNull(), // draft | published
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const releases = pgTable('releases', {
  id: uuid('id').defaultRandom().primaryKey(),
  draftId: uuid('draft_id')
    .references(() => releaseDrafts.id)
    .notNull(),
  githubReleaseId: bigint('github_release_id', {
    mode: 'number',
  }).notNull(),
  releaseUrl: text('release_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
  })
);

// Join The Waitlist DB Schema
export const WAITLIST_SOURCES = [
  'youtube',
  'linkedin',
  'twitter',
  'friend',
  'reddit',
  'google',
  'producthunt',
  'other',
] as const;

export const waitlistSourceEnum = pgEnum('waitlist_source', WAITLIST_SOURCES);

export const waitlist = pgTable('waitlist', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  source: waitlistSourceEnum('source'), // youtube | twitter | linkedin | friend | producthunt
  invited: boolean('invited').default(false).notNull(),
  signedUp: boolean('signed_up').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Repository = typeof repositories.$inferSelect;
export type ReleaseDraft = typeof releaseDrafts.$inferSelect;
export type Release = typeof releases.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewRepository = typeof repositories.$inferInsert;
export type NewReleaseDraft = typeof releaseDrafts.$inferInsert;
export type NewRelease = typeof releases.$inferInsert;

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
