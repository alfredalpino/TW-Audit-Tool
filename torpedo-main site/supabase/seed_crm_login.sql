-- CRM login: create admin@torpedoweb.org in auth so they can sign in at /crm
-- Run in Supabase Dashboard → SQL Editor (must run as project owner / postgres).
-- After running, change the password in production.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_email   TEXT := 'admin@torpedoweb.org';
  v_encrypted_pw TEXT := crypt('admin@torpode.L@!3A', gen_salt('bf'));
BEGIN
  -- Remove existing user with this email so script is re-runnable
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = v_email);
  DELETE FROM auth.users WHERE email = v_email;

  -- 1. Insert into auth.users (token columns must be '' not NULL or login fails with "Database error querying schema")
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    v_email,
    v_encrypted_pw,
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW()
  );

  -- 2. Link identity (required for sign-in; id = PK, provider_id = user id for email provider)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    v_user_id,
    format('{"sub": "%s", "email": "%s"}', v_user_id, v_email)::jsonb,
    'email',
    v_user_id::text,
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'CRM user created: % (id: %)', v_email, v_user_id;
END $$;