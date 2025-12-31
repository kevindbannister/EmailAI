ALTER TABLE oauth_accounts
  ADD COLUMN IF NOT EXISTS provider_account_id TEXT,
  ADD COLUMN IF NOT EXISTS last_connected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requires_reauth BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE oauth_accounts
  ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

ALTER TABLE oauth_accounts
  DROP CONSTRAINT IF EXISTS oauth_accounts_user_id_provider_key;

CREATE UNIQUE INDEX IF NOT EXISTS oauth_accounts_provider_account_idx
  ON oauth_accounts (provider, provider_account_id);

CREATE INDEX IF NOT EXISTS oauth_accounts_user_provider_idx
  ON oauth_accounts (user_id, provider);

UPDATE oauth_accounts
SET last_connected_at = COALESCE(last_connected_at, updated_at);

CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  return_to TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS oauth_states_expires_idx ON oauth_states (expires_at);
