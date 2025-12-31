import { query } from './index.js';

export const getOauthAccountByUser = async ({ userId, provider }) => {
  const result = await query(
    `SELECT id, user_id, provider, email, provider_account_id, tenant_id, access_token, refresh_token, expires_at, scope,
            requires_reauth, last_connected_at, last_sync_at, created_at, updated_at
     FROM oauth_accounts
     WHERE user_id = $1 AND provider = $2
     ORDER BY last_connected_at DESC NULLS LAST, created_at DESC
     LIMIT 1`,
    [userId, provider]
  );
  return result.rows[0] ?? null;
};

export const upsertOauthAccount = async ({
  userId,
  provider,
  email,
  providerAccountId,
  tenantId,
  accessToken,
  refreshToken,
  expiresAt,
  scope,
}) => {
  const result = await query(
    `INSERT INTO oauth_accounts
      (user_id, provider, email, provider_account_id, tenant_id, access_token, refresh_token, expires_at, scope, last_connected_at, requires_reauth)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), false)
     ON CONFLICT (provider, provider_account_id)
     DO UPDATE SET
        email = EXCLUDED.email,
        user_id = EXCLUDED.user_id,
        tenant_id = EXCLUDED.tenant_id,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        scope = EXCLUDED.scope,
        last_connected_at = NOW(),
        requires_reauth = false,
        updated_at = NOW()
     RETURNING *`,
    [userId, provider, email, providerAccountId, tenantId, accessToken, refreshToken, expiresAt, scope]
  );
  return result.rows[0];
};

export const updateOauthTokens = async ({ accountId, accessToken, refreshToken, expiresAt, scope }) => {
  const result = await query(
    `UPDATE oauth_accounts
     SET access_token = $1,
         refresh_token = COALESCE($2, refresh_token),
         expires_at = $3,
         scope = $4,
         requires_reauth = false,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [accessToken, refreshToken, expiresAt, scope, accountId]
  );
  return result.rows[0] ?? null;
};

export const markOauthAccountReauthRequired = async ({ accountId }) => {
  await query(
    `UPDATE oauth_accounts
     SET requires_reauth = true, updated_at = NOW()
     WHERE id = $1`,
    [accountId]
  );
};

export const updateOauthAccountLastSyncAt = async ({ accountId }) => {
  await query(
    `UPDATE oauth_accounts
     SET last_sync_at = NOW(), updated_at = NOW()
     WHERE id = $1`,
    [accountId]
  );
};

export const deleteOauthAccountById = async ({ accountId }) => {
  await query('DELETE FROM oauth_accounts WHERE id = $1', [accountId]);
};
