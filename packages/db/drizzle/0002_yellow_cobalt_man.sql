ALTER TABLE "clients" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "telegram_username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bd_day" smallint;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bb_month" smallint;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "telegramUsername";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bdDay";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bbMonth";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updatedAt";