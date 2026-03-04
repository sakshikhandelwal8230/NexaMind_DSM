-- ============================================
-- NexaMind DSM — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. PROFILES TABLE (extends auth.users)
-- Every signup creates a profile with is_approved = false
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  facility_type TEXT DEFAULT 'Hospital' CHECK (facility_type IN ('Hospital', 'Pharmacy', 'Warehouse', 'Clinic')),
  zone TEXT DEFAULT 'Central' CHECK (zone IN ('North', 'South', 'East', 'West', 'Central')),
  verification_status TEXT DEFAULT 'Unverified' CHECK (verification_status IN ('Verified', 'Pending', 'Unverified', 'Rejected')),
  plan TEXT DEFAULT 'Starter' CHECK (plan IN ('Starter', 'Pro', 'Enterprise')),
  next_billing_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
  business_license_no TEXT,
  license_file_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  account_status TEXT DEFAULT 'pending' CHECK (account_status IN ('pending', 'active', 'suspended', 'rejected')),
  deleted_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.b AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.c SECURITY DEFINER FUNCTION FOR AUDIT LOGGING
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type TEXT,
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, action_type, target_type, target_id, metadata)
  VALUES (auth.uid(), action_type, target_type, target_id, metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.a Break Recursion Functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_user_approved(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT is_approved FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- When a user signs up, automatically create their profile row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    organization_name,
    license_number,
    is_approved,
    account_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'hospital'),
    COALESCE(NEW.raw_user_meta_data->>'organization_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'license_number', ''),
    FALSE,       -- NOT approved by default
    'pending'    -- pending until admin approves
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. MEDICINES TABLE
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'OTC' CHECK (category IN ('OTC', 'Prescription')),
  current_stock INTEGER DEFAULT 0,
  min_threshold INTEGER DEFAULT 0,
  expiry_date TEXT,
  batch_number TEXT,
  manufacturer TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'critical', 'success')),
  is_read BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.a TRANSFERS TABLE
CREATE TABLE IF NOT EXISTS public.transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  from_facility TEXT,
  to_facility TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'dispatched', 'received', 'rejected')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'critical')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.b REORDERS TABLE
CREATE TABLE IF NOT EXISTS public.reorders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID REFERENCES public.medicines(id),
  medicine_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'received', 'cancelled')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON public.medicines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Medicines Policies (Admin Read-Only Oversight, Users local CRUD)
DROP POLICY IF EXISTS "Admin full access medicines" ON public.medicines;
CREATE POLICY "Admin oversight medicines"
  ON public.medicines FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can manage own medicines"
  ON public.medicines FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.is_user_approved(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND public.is_user_approved(auth.uid()));

-- Transfers Policies (Global Admin Read, Users local access)
DROP POLICY IF EXISTS "Admin full access transfers" ON public.transfers;
CREATE POLICY "Admin oversight transfers"
  ON public.transfers FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view relevant transfers"
  ON public.transfers FOR SELECT
  TO authenticated
  USING (public.is_user_approved(auth.uid()));

CREATE POLICY "Users can initiate transfers"
  ON public.transfers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_user_approved(auth.uid()));

-- Audit Logs Policies
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- 7. ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reorders;

-- 8. STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'documents');

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');
