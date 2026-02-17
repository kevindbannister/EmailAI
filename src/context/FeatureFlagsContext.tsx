import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

export type FeatureFlags = {
  dashboard: boolean;
  inbox: boolean;
  labels: boolean;
  rules: boolean;
  drafting: boolean;
  writingStyle: boolean;
  signatureTimeZone: boolean;
  professionalContext: boolean;
  account: boolean;
  help: boolean;
};

type FeatureFlagsContextValue = {
  flags: FeatureFlags;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
  updateFlags: (nextFlags: FeatureFlags) => Promise<void>;
};

const defaultFlags: FeatureFlags = {
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

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined);

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFlags = useCallback(async () => {
    if (!isAuthenticated) {
      setFlags(defaultFlags);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.get<{ flags: FeatureFlags }>('/api/feature-flags');
      setFlags({ ...defaultFlags, ...data.flags });
    } catch {
      setFlags(defaultFlags);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshFlags();
  }, [refreshFlags]);

  const value = useMemo(
    () => ({
      flags,
      isLoading,
      refreshFlags,
      updateFlags: async (nextFlags: FeatureFlags) => {
        const data = await api.put<{ flags: FeatureFlags }>('/api/feature-flags', { flags: nextFlags });
        setFlags({ ...defaultFlags, ...data.flags });
      },
    }),
    [flags, isLoading, refreshFlags]
  );

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};
