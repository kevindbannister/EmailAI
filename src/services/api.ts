export const connectEmailProvider = async (provider: 'gmail' | 'outlook'): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.info(`Connected ${provider} provider (placeholder API call).`);
};

export const connectIntegration = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.info(`Connected integration ${id} (placeholder API call).`);
};

export const disconnectIntegration = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.info(`Disconnected integration ${id} (placeholder API call).`);
};

export const saveSettings = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.info('Settings saved (placeholder API call).');
};

export interface MicrosoftIntegrationStatus {
  status: 'not_connected' | 'connected' | 'token_expired' | 'reauth_required' | 'error';
  email?: string;
  tenantId?: string | null;
  expiresAt?: string | null;
  lastSyncAt?: string | null;
}

export interface GoogleIntegrationStatus {
  connected: boolean;
  email?: string | null;
  expires_at?: string | null;
  requires_reauth?: boolean;
  last_sync_at?: string | null;
}

export const getMicrosoftIntegrationStatus = async (userId: string): Promise<MicrosoftIntegrationStatus> => {
  const response = await fetch(`/integrations/microsoft/status?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    return { status: 'error' };
  }
  return response.json();
};

export const disconnectMicrosoftIntegration = async (userId: string): Promise<void> => {
  await fetch(`/integrations/microsoft/disconnect?user_id=${encodeURIComponent(userId)}`, { method: 'POST' });
};

export const startMicrosoftOAuth = (userId: string): void => {
  window.location.href = `/auth/microsoft/start?user_id=${encodeURIComponent(userId)}`;
};

export const getGoogleIntegrationStatus = async (userId: string): Promise<GoogleIntegrationStatus> => {
  const response = await fetch(`/integrations/google/status?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    return { connected: false, requires_reauth: false };
  }
  return response.json();
};

export const disconnectGoogleIntegration = async (userId: string): Promise<void> => {
  await fetch(`/integrations/google/disconnect?user_id=${encodeURIComponent(userId)}`, { method: 'POST' });
};

export const testGoogleIntegration = async (userId: string): Promise<{ ok: boolean; email?: string }> => {
  const response = await fetch(`/integrations/google/test-connection?user_id=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    return { ok: false };
  }
  return response.json();
};

export const startGoogleOAuth = (userId: string): void => {
  window.location.href = `/auth/google/start?user_id=${encodeURIComponent(userId)}`;
};
