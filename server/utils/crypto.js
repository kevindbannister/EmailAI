import crypto from 'node:crypto';

const ENCRYPTION_KEY = process.env.APP_ENCRYPTION_KEY;

const getEncryptionKey = () => {
  if (!ENCRYPTION_KEY) {
    throw new Error('APP_ENCRYPTION_KEY is required to encrypt OAuth tokens.');
  }

  const keyBuffer =
    ENCRYPTION_KEY.length >= 43 ? Buffer.from(ENCRYPTION_KEY, 'base64') : Buffer.from(ENCRYPTION_KEY, 'utf8');
  if (keyBuffer.length !== 32) {
    throw new Error('APP_ENCRYPTION_KEY must be 32 bytes (base64 or raw string).');
  }

  return keyBuffer;
};

export const encrypt = (value) => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join('.');
};

export const decrypt = (payload) => {
  if (!payload) return null;
  const [ivB64, tagB64, encryptedB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error('Invalid encrypted token payload.');
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
};
