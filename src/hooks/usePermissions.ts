// import { useAuth } from './useAuth';
import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userPermissions = user?.roleId?.permissions || [];

  const hasPermission = (permission: Permission): boolean => {
    // Check for wildcard permission (*)
    if (userPermissions.includes('*')) return true;
    // Check for specific permission
    return userPermissions.includes(permission);
  };

  const canCreate = (module: string): boolean => {
    return hasPermission(`${module}.create` as Permission);
  };

  const canUpdate = (module: string): boolean => {
    return hasPermission(`${module}.update` as Permission);
  };

  const canDelete = (module: string): boolean => {
    return hasPermission(`${module}.delete` as Permission);
  };

  const canRead = (module: string): boolean => {
    return hasPermission(`${module}.read` as Permission);
  };

  return {
    hasPermission,
    canCreate,
    canUpdate,
    canDelete,
    canRead,
    userPermissions,
  };
};
