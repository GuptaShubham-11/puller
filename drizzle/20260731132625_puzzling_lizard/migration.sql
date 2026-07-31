CREATE TYPE "provider" AS ENUM('github', 'google');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('user', 'admin', 'superadmin');--> statement-breakpoint
CREATE TYPE "waitlist_source" AS ENUM('youtube', 'linkedin', 'twitter', 'friend', 'reddit', 'google', 'producthunt', 'other');--> statement-breakpoint
CREATE TABLE "release_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"repository_id" uuid NOT NULL,
	"from_tag" text NOT NULL,
	"to_tag" text NOT NULL,
	"markdown" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"draft_id" uuid NOT NULL,
	"github_release_id" bigint NOT NULL,
	"release_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"github_repo_id" bigint NOT NULL,
	"repo_url" text NOT NULL,
	"token" text NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"provider" "provider" NOT NULL,
	"role" "role" DEFAULT 'user'::"role" NOT NULL,
	"ip" text NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"source" "waitlist_source",
	"invited" boolean DEFAULT false NOT NULL,
	"signed_up" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "release_drafts" ADD CONSTRAINT "release_drafts_repository_id_repositories_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id");--> statement-breakpoint
ALTER TABLE "releases" ADD CONSTRAINT "releases_draft_id_release_drafts_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "release_drafts"("id");--> statement-breakpoint
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");