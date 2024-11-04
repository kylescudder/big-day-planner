CREATE TABLE IF NOT EXISTS "guest" (
	"id" uuid PRIMARY KEY NOT NULL,
	"forename" varchar NOT NULL,
	"surname" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar(256),
	"address3" varchar(256),
	"town" varchar,
	"county" varchar,
	"postcode" varchar,
	"starterId" uuid,
	"mainId" uuid,
	"puddingId" uuid,
	"song" varchar NOT NULL,
	"artist" varchar NOT NULL,
	"rsvp" boolean,
	"rsvp_answer" boolean,
	"parentId" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pudding" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "starter" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" varchar(256)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest" ADD CONSTRAINT "guest_starterId_starter_id_fk" FOREIGN KEY ("starterId") REFERENCES "public"."starter"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest" ADD CONSTRAINT "guest_mainId_main_id_fk" FOREIGN KEY ("mainId") REFERENCES "public"."main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest" ADD CONSTRAINT "guest_puddingId_pudding_id_fk" FOREIGN KEY ("puddingId") REFERENCES "public"."pudding"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_id_idx" ON "guest" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_forename_idx" ON "guest" USING btree ("forename");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_email_idx" ON "guest" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_id_idx" ON "main" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_text_idx" ON "main" USING btree ("text");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pudding_id_idx" ON "pudding" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pudding_text_idx" ON "pudding" USING btree ("text");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "starter_id_idx" ON "starter" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "starter_text_idx" ON "starter" USING btree ("text");