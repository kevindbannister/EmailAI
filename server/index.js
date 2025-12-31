import express from 'express';
import { authMicrosoftRouter } from './routes/authMicrosoft.js';
import { integrationsMicrosoftRouter } from './routes/integrationsMicrosoft.js';
import { authGoogleRouter } from './routes/authGoogle.js';
import { integrationsGoogleRouter } from './routes/integrationsGoogle.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth/microsoft', authMicrosoftRouter);
app.use('/integrations/microsoft', integrationsMicrosoftRouter);
app.use('/auth/google', authGoogleRouter);
app.use('/integrations/google', integrationsGoogleRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
