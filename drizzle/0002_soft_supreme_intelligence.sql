CREATE TABLE IF NOT EXISTS "espoused" (
	"id" uuid PRIMARY KEY NOT NULL,
	"espoused" varchar NOT NULL,
	"address2" varchar(256)
);
