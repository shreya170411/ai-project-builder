CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  college text NOT NULL,
  graduation_year int NOT NULL,
  target_role text NOT NULL,
  referral_code text NOT NULL UNIQUE,
  referred_by text,
  referral_count int NOT NULL DEFAULT 0,
  reward_unlocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  session_id text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.register_student(
  _name text, _email text, _phone text, _college text, _year int, _role text, _ref text, _session text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _code text;
  _referrer public.registrations%ROWTYPE;
  _valid_ref text := NULL;
  _new_count int;
  _unlocked boolean;
BEGIN
  _email := lower(trim(_email));
  IF EXISTS (SELECT 1 FROM registrations WHERE email = _email) THEN
    RETURN jsonb_build_object('error', 'duplicate_email');
  END IF;
  IF _ref IS NOT NULL AND length(_ref) > 0 THEN
    SELECT * INTO _referrer FROM registrations WHERE referral_code = upper(_ref) FOR UPDATE;
    IF FOUND AND _referrer.email <> _email THEN
      _valid_ref := _referrer.referral_code;
    END IF;
  END IF;
  LOOP
    _code := 'AI' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM registrations WHERE referral_code = _code);
  END LOOP;
  INSERT INTO registrations(name,email,phone,college,graduation_year,target_role,referral_code,referred_by)
  VALUES (_name,_email,_phone,_college,_year,_role,_code,_valid_ref);
  INSERT INTO events(name, session_id, meta) VALUES ('registration_completed', _session, jsonb_build_object('code', _code));
  IF _valid_ref IS NOT NULL THEN
    UPDATE registrations SET referral_count = referral_count + 1,
      reward_unlocked = (referral_count + 1) >= 2
      WHERE referral_code = _valid_ref
      RETURNING referral_count, reward_unlocked INTO _new_count, _unlocked;
    INSERT INTO events(name, session_id, meta) VALUES ('referral_registration_completed', _session, jsonb_build_object('referrer', _valid_ref));
    IF _new_count = 2 THEN
      INSERT INTO events(name, session_id, meta) VALUES ('reward_unlocked', NULL, jsonb_build_object('code', _valid_ref));
    END IF;
  END IF;
  RETURN jsonb_build_object('code', _code, 'referred_by', _valid_ref);
END $$;
REVOKE ALL ON FUNCTION public.register_student(text,text,text,text,int,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_student(text,text,text,text,int,text,text,text) TO service_role;