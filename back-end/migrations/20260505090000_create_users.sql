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
