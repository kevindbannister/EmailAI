const { OAuth2Client } = require('google-auth-library');

const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly'
];

function createOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function registerGoogleAuth(app) {
  app.get('/auth/google', async (req, res) => {
    try {
      const oauthClient = createOAuthClient();
      const authUrl = oauthClient.generateAuthUrl({
        scope: GOOGLE_SCOPES
      });
      return res.redirect(authUrl);
    } catch (error) {
      console.error('Google OAuth start error:', error);
      return res.status(500).json({ error: 'Google OAuth start failed' });
    }
  });

  app.get('/auth/google/callback', async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        throw new Error('Missing OAuth code');
      }

      const oauthClient = createOAuthClient();
      const { tokens } = await oauthClient.getToken(code);
      oauthClient.setCredentials(tokens);

      const userInfoResponse = await oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo'
      });

      const { email, name, id } = userInfoResponse.data || {};

      let scopesGranted = [];
      if (tokens.access_token) {
        const tokenInfo = await oauthClient.getTokenInfo(tokens.access_token);
        scopesGranted = tokenInfo.scopes || [];
      } else if (tokens.scope) {
        scopesGranted = tokens.scope.split(' ');
      }

      return res.json({
        email,
        name,
        googleUserId: id,
        scopesGranted
      });
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return res.status(500).json({ error: 'Google OAuth callback failed' });
    }
  });
}

module.exports = { registerGoogleAuth };
