import { consumeOauthState, createOauthState } from '../db/oauthStates.js';

export const createOAuthState = async ({ userId, returnTo }) => createOauthState({ userId, returnTo });

export const verifyOAuthState = async (state) => {
  if (!state || typeof state !== 'string') return null;
  return consumeOauthState({ state });
};
