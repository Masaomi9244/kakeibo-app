-- 目的: アプリ利用者をSupabase Authのuserと対応づけるusers tableを作成する。
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_provider_user_id text NOT NULL,
    email text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_auth_provider_user_id_check
    CHECK (length(trim(auth_provider_user_id)) > 0),
    CONSTRAINT users_email_check
    CHECK (length(trim(email)) > 0)
);

CREATE UNIQUE INDEX users_auth_provider_user_id_unique
ON users (auth_provider_user_id);

CREATE UNIQUE INDEX users_email_unique
ON users (email);

COMMENT ON TABLE users IS 'アプリ利用者と認証provider userを対応づけるtable';

COMMENT ON COLUMN users.id IS 'アプリ内部で利用するuserのUUID primary key';
COMMENT ON COLUMN users.auth_provider_user_id IS 'Supabase Authなど外部認証providerのuser id';
COMMENT ON COLUMN users.email IS 'ログインと表示に利用するuser email';
COMMENT ON COLUMN users.created_at IS 'user recordの作成日時';
COMMENT ON COLUMN users.updated_at IS 'user recordの最終更新日時';

COMMENT ON INDEX users_auth_provider_user_id_unique IS '外部認証provider user idの重複登録を防ぐunique index';
COMMENT ON INDEX users_email_unique IS '同一emailの重複登録を防ぐunique index';
