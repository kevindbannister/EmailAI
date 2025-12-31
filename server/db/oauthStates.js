import crypto from 'node:crypto';
import { query } from './index.js';

const STATE_TTL_MINUTES = 10;

export const createOauthState = async ({ userId, returnTo }) => {
  const state = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + STATE_TTL_MINUTES * 60 * 1000).toISOString();

  await query(
    `INSERT INTO oauth_states (state, user_id, return_to, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [state, userId, returnTo ?? null, expiresAt]
  );

  return state;
};

export const consumeOauthState = async ({ state }) => {
  const result = await query(
    `DELETE FROM oauth_states
     WHERE state = $1 AND expires_at > NOW()
     RETURNING state, user_id, return_to`,
    [state]
  );

  return result.rows[0] ?? null;
};
