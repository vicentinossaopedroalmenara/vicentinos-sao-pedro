CREATE TABLE "beneficiaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"document" varchar(25) NOT NULL,
	"phone" varchar(50),
	"birth_date" varchar(20),
	"street" varchar(255) NOT NULL,
	"number" varchar(50) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(10) NOT NULL,
	"zip_code" varchar(20) NOT NULL,
	"complement" varchar(255),
	"reference_point" text,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "beneficiaries_document_unique" UNIQUE("document")
);
--> statement-breakpoint
CREATE TABLE "delivery_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"beneficiary_id" integer NOT NULL,
	"delivered_at" timestamp DEFAULT now() NOT NULL,
	"reference_month" varchar(10) NOT NULL,
	"description" text,
	"delivered_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_history" ADD CONSTRAINT "delivery_history_beneficiary_id_beneficiaries_id_fk" FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiaries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "beneficiaries_document_idx" ON "beneficiaries" USING btree ("document");--> statement-breakpoint
CREATE INDEX "beneficiaries_neighborhood_idx" ON "beneficiaries" USING btree ("neighborhood");--> statement-breakpoint
CREATE INDEX "beneficiaries_status_idx" ON "beneficiaries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "delivery_history_beneficiary_idx" ON "delivery_history" USING btree ("beneficiary_id");--> statement-breakpoint
CREATE INDEX "delivery_history_month_idx" ON "delivery_history" USING btree ("reference_month");