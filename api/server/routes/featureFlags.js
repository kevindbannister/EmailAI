const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'featureFlags.json');

const DEFAULT_FLAGS = {
  dashboard: true,
  inbox: true,
  labels: true,
  rules: true,
  drafting: true,
  writingStyle: true,
  signatureTimeZone: true,
  professionalContext: true,
  account: true,
  help: true,
};

let cache = null;

async function readFlagsFromDisk() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_FLAGS, ...(parsed.flags || {}) };
  } catch (error) {
    return { ...DEFAULT_FLAGS };
  }
}

async function loadFlags() {
  if (cache) {
    return cache;
  }

  cache = await readFlagsFromDisk();
  return cache;
}

async function saveFlags(flags) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    STORE_PATH,
    JSON.stringify({ flags, updatedAt: new Date().toISOString() }, null, 2),
    'utf8'
  );
}

function registerFeatureFlagRoutes(app) {
  app.get('/api/feature-flags', async (_req, res) => {
    try {
      const flags = await loadFlags();
      res.json({ flags });
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      res.status(500).json({ error: 'Failed to load feature flags' });
    }
  });

  app.put('/api/feature-flags', async (req, res) => {
    try {
      const isMasterSession = req.headers['x-master-session'] === 'true';
      if (!isMasterSession) {
        res.status(403).json({ error: 'Master access required' });
        return;
      }

      const incomingFlags = req.body?.flags;
      if (!incomingFlags || typeof incomingFlags !== 'object') {
        res.status(400).json({ error: 'Invalid flags payload' });
        return;
      }

      const updatedFlags = { ...DEFAULT_FLAGS };
      Object.keys(DEFAULT_FLAGS).forEach((key) => {
        if (typeof incomingFlags[key] === 'boolean') {
          updatedFlags[key] = incomingFlags[key];
        }
      });

      cache = updatedFlags;
      await saveFlags(updatedFlags);

      res.json({ flags: updatedFlags });
    } catch (error) {
      console.error('Failed to update feature flags:', error);
      res.status(500).json({ error: 'Failed to update feature flags' });
    }
  });
}

module.exports = { registerFeatureFlagRoutes, DEFAULT_FLAGS };
