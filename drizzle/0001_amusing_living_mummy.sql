CREATE TABLE IF NOT EXISTS "detail" (
	"id" uuid PRIMARY KEY NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar(256),
	"address3" varchar(256),
	"town" varchar,
	"county" varchar,
	"postcode" varchar,
	"details_text_subheader" varchar(256),
	"adults_only" boolean,
	"adults_only_text" varchar(256),
	"details_text" varchar(1024),
	"dresscode" varchar(256)
);
--> statement-breakpoint
DROP INDEX IF EXISTS "guest_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "guest_forename_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "guest_email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "main_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "main_text_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "pudding_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "pudding_text_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "starter_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "starter_text_idx";