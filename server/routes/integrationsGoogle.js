import express from 'express';
import { createGoogleOAuthClient } from '../services/googleAuth.js';
import { callGmailApi, ensureValidGoogleAccessToken } from '../services/googleClient.js';
import { decrypt } from '../utils/crypto.js';
import { deleteOauthAccountById, getOauthAccountByUser } from '../db/oauthAccounts.js';

export const integrationsGoogleRouter = express.Router();

const getUserIdFromRequest = (req) => {
  if (req.user?.id) return req.user.id;
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId) return Array.isArray(headerUserId) ? headerUserId[0] : headerUserId;
  return req.query.user_id;
};

integrationsGoogleRouter.get('/status', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id.' });
  }

  try {
    const account = await getOauthAccountByUser({ userId, provider: 'google' });
    if (!account) {
      return res.json({ connected: false });
    }

    const tokenStatus = await ensureValidGoogleAccessToken({ userId });
    const accountSnapshot = tokenStatus.account ?? account;
    const isConnected = tokenStatus.status === 'connected';
    const requiresReauth = tokenStatus.status === 'reauth_required';

    return res.json({
      connected: isConnected,
      email: accountSnapshot.email,
      expires_at: accountSnapshot.expires_at,
      requires_reauth: requiresReauth,
      last_sync_at: accountSnapshot.last_sync_at,
    });
  } catch (error) {
    return res.status(500).json({ connected: false, error: 'status_error' });
  }
});

integrationsGoogleRouter.post('/disconnect', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id.' });
  }

  const account = await getOauthAccountByUser({ userId, provider: 'google' });
  if (account) {
    const accessToken = decrypt(account.access_token);
    if (accessToken) {
      const client = createGoogleOAuthClient();
      try {
        await client.revokeToken(accessToken);
      } catch (error) {
        // Ignore revoke failures and continue with disconnect cleanup.
      }
    }
    await deleteOauthAccountById({ accountId: account.id });
  }

  return res.status(204).send();
});

integrationsGoogleRouter.get('/test-connection', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id.' });
  }

  try {
    const response = await callGmailApi({
      userId,
      action: (gmail) => gmail.users.getProfile({ userId: 'me' }),
    });
    return res.json({ ok: true, email: response.data.emailAddress });
  } catch (error) {
    if (error.status === 'reauth_required' || error.status === 'not_connected') {
      return res.status(401).json({ ok: false, status: error.status });
    }
    return res.status(500).json({ ok: false, status: 'error' });
  }
});
