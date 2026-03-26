CREATE TYPE "public"."role" AS ENUM('client', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"role" "role" DEFAULT 'client',
	"monthly_quota" integer DEFAULT 5,
	"used_quota" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "request_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"file_url" text,
	"file_type" text
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"status" "status" DEFAULT 'pending',
	"geojson" jsonb,
	"area" real,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "request_files" ADD CONSTRAINT "request_files_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- RLS Helper Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;--> statement-breakpoint

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE request_files ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);--> statement-breakpoint

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id);--> statement-breakpoint

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

-- Requests Policies
CREATE POLICY "Users can view own requests" ON requests
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);--> statement-breakpoint

CREATE POLICY "Users can create requests" ON requests
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);--> statement-breakpoint

CREATE POLICY "Users can update own requests" ON requests
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id);--> statement-breakpoint

CREATE POLICY "Admins can view all requests" ON requests
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

CREATE POLICY "Admins can update all requests" ON requests
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

CREATE POLICY "Admins can delete requests" ON requests
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

-- Request Files Policies
CREATE POLICY "Users can view own request files" ON request_files
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_files.request_id
      AND requests.user_id = (SELECT auth.uid())
    )
  );--> statement-breakpoint

CREATE POLICY "Users can add files to own requests" ON request_files
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_files.request_id
      AND requests.user_id = (SELECT auth.uid())
    )
  );--> statement-breakpoint

CREATE POLICY "Users can delete own request files" ON request_files
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_files.request_id
      AND requests.user_id = (SELECT auth.uid())
    )
  );--> statement-breakpoint

CREATE POLICY "Admins can view all request files" ON request_files
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

CREATE POLICY "Admins can delete any request files" ON request_files
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin()));--> statement-breakpoint

-- Performance Indexes for RLS
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles (role);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS requests_user_id_idx ON requests (user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS request_files_request_id_idx ON request_files (request_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS requests_status_idx ON requests (status);