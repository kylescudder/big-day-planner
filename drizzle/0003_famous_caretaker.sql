ALTER TABLE "espoused" RENAME COLUMN "espoused" TO "groom";--> statement-breakpoint
ALTER TABLE "espoused" RENAME COLUMN "address2" TO "bride";--> statement-breakpoint
ALTER TABLE "detail" ALTER COLUMN "address1" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "detail" ALTER COLUMN "town" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "detail" ALTER COLUMN "county" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "detail" ALTER COLUMN "postcode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "espoused" ADD COLUMN "groom_email" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "espoused" ADD COLUMN "bride_email" varchar(256) NOT NULL;