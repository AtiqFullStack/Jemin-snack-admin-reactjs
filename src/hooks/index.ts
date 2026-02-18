import { usePageContext } from './usePageContext.tsx';
import useFetchData from './useFetchData.tsx';

export { usePageContext, useFetchData };

// Auth hook (re-export from context)
export { useAuth } from '../contexts/AuthContext';

// Permissions hook
export { usePermissions } from './usePermissions';

// Dashboard data hooks (re-export from lib/queries)
export * from '../lib/queries';
