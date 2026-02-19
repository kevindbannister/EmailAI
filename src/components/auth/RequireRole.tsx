import type { ReactNode } from 'react';
import { useAppContext } from '../../context/AppContext';
import AccessDenied from '../../pages/AccessDenied';
import { AppLoadingScreen } from './RequireAuth';

type RequireRoleProps = {
  role: string;
  children: ReactNode;
};

const RequireRole = ({ role, children }: RequireRoleProps) => {
  const { loading, role: currentRole } = useAppContext();

  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!currentRole || currentRole !== role) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default RequireRole;
