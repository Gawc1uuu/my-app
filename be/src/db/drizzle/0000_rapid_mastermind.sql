CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."transaction_sub_type" AS ENUM('reward', 'purchase', 'refund');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('deposit', 'credit');--> statement-breakpoint
CREATE TABLE "transactions" (
	"transaction_id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"type" "transaction_type" NOT NULL,
	"sub_type" "transaction_sub_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "transaction_status" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
