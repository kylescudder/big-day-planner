CREATE TABLE "colours" (
	"id" uuid PRIMARY KEY NOT NULL,
	"hex" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detail" (
	"id" uuid PRIMARY KEY NOT NULL,
	"start_date_time" timestamp,
	"end_date_time" timestamp,
	"address1" varchar(256) NOT NULL,
	"address2" varchar(256),
	"address3" varchar(256),
	"town" varchar NOT NULL,
	"county" varchar NOT NULL,
	"postcode" varchar NOT NULL,
	"details_text_subheader" varchar(256),
	"details_text" varchar(1024),
	"adults_only_text" varchar(256),
	"dresscode" varchar(256),
	"registryMessage" varchar(500),
	"song_request" boolean,
	"rsvp_deadline_date_time" timestamp,
	"menu_deadline_date_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "espoused" (
	"id" uuid PRIMARY KEY NOT NULL,
	"groom" varchar(256) NOT NULL,
	"bride" varchar(256) NOT NULL,
	"groom_email" varchar(256) NOT NULL,
	"bride_email" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest" (
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
	"dietaryRequirements" varchar(256),
	"guestKey" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"url" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" varchar(256) NOT NULL,
	"key" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "pudding" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "starter" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "taxi" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar(256),
	"phone" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timing" (
	"id" uuid PRIMARY KEY NOT NULL,
	"time" timestamp NOT NULL,
	"event" varchar(256),
	"alt_text" varchar(256),
	"image_url" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "guest" ADD CONSTRAINT "guest_starterId_starter_id_fk" FOREIGN KEY ("starterId") REFERENCES "public"."starter"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest" ADD CONSTRAINT "guest_mainId_main_id_fk" FOREIGN KEY ("mainId") REFERENCES "public"."main"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest" ADD CONSTRAINT "guest_puddingId_pudding_id_fk" FOREIGN KEY ("puddingId") REFERENCES "public"."pudding"("id") ON DELETE no action ON UPDATE no action;