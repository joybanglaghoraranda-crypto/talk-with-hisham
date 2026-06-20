-- ============================================
-- SECURITY FIXES FOR SUPABASE ADVISOR
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Fix "Function Search Path Mutable"
-- Secures the trigger function so it executes safely within the public schema
ALTER FUNCTION public.restrict_message_updates() SET search_path = public;

-- 2. Fix "Public/Signed-In Users Can Execute SECURITY DEFINER Function"
-- Trigger functions should only be called by the database itself, not directly by users
REVOKE EXECUTE ON FUNCTION public.restrict_message_updates() FROM public;
REVOKE EXECUTE ON FUNCTION public.restrict_message_updates() FROM anon, authenticated;

-- (Optional) If you have another function named rls_auto_enable, secure it too:
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    ALTER FUNCTION public.rls_auto_enable() SET search_path = public;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
  END IF;
END $$;
