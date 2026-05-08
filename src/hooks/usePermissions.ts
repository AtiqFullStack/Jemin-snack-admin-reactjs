import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { PermissionObj } from '../config/permissions';
import { apiRequest } from 'src/services/api/apiClient';
import { API_ENDPOINTS } from 'src/services/api/endpoints';

export const usePermissions = () => {
  const { user } = useAuth() as any;
  const roleId = user?.roleId?._id || user?.roleId;
  const [userPermissions, setUserPermissions] = useState<PermissionObj[]>(
    user?.roleId?.permissions || []
  );
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(!!roleId);

  useEffect(() => {
    if (!roleId) {
      setIsPermissionsLoading(false);
      return;
    }
    setIsPermissionsLoading(true);
    apiRequest
      .get(API_ENDPOINTS.ROLES.LIST(roleId))
      .then((res: any) => {
        const role = Array.isArray(res.data) ? res.data[0] : res.data;
        if (role?.permissions?.length) {
          setUserPermissions(role.permissions);
        }
      })
      .catch(() => {})
      .finally(() => setIsPermissionsLoading(false));
  }, [roleId]);

  // Find permission object for a module
  const getModulePermission = (module: string): PermissionObj | undefined => {
    if (user?.isAdmin) return undefined; // Admin has all permissions
    return userPermissions.find((p) => p.module === module);
  };

  // Check if user has specific action on a module
  const hasAction = (module: string, action: string): boolean => {
    if (user?.isAdmin) return true; // Admin has all actions
    const permission = getModulePermission(module);
    if (!permission) return false;
    return permission.actions.includes(action as any);
  };

  // Check if user has specific scope on a module
  const hasScope = (module: string, scope: string): boolean => {
    if (user?.isAdmin) return true; // Admin has all scopes
    const permission = getModulePermission(module);
    if (!permission) return false;
    return permission.scope === scope;
  };

  // Check if user has any permission on a module
  const hasModuleAccess = (module: string): boolean => {
    if (user?.isAdmin) return true; // Admin has access to all modules
    return !!getModulePermission(module);
  };

  // Check if user can read
  const canRead = (module: string): boolean => {
    if (user?.isAdmin) return true;
    return hasAction(module, 'read');
  };

  // Check if user can create
  const canCreate = (module: string): boolean => {
    if (user?.isAdmin) return true;
    return hasAction(module, 'create');
  };

  // Check if user can update
  const canUpdate = (module: string): boolean => {
    if (user?.isAdmin) return true;
    return hasAction(module, 'update');
  };

  // Check if user can delete
  const canDelete = (module: string): boolean => {
    if (user?.isAdmin) return true;
    return hasAction(module, 'delete');
  };

  // Check if user has permission with specific scope
  const canAccessWithScope = (
    module: string,
    action: string,
    scope: string
  ): boolean => {
    if (user?.isAdmin) return true;
    const permission = getModulePermission(module);
    if (!permission) return false;
    return (
      permission.actions.includes(action as any) && permission.scope === scope
    );
  };

  // Get all modules user has access to
  const getAccessibleModules = (): string[] => {
    if (user?.isAdmin) {
      // Return all available modules for admin
      return [
        'staff',
        'attendance',
        'leave',
        'salary',
        'payroll',
        'leads',
        'customers',
        'deals',
        'products',
        'calls',
        'messages',
        'reports',
        'settings',
        'roles',
        'users',
      ];
    }
    return userPermissions.map((p) => p.module);
  };

  // Check if user has permission (generic check)
  const hasPermission = (module: string, action?: string): boolean => {
    if (user?.isAdmin) return true; // Admin has all permissions
    if (!action) {
      return hasModuleAccess(module);
    }
    return hasAction(module, action);
  };

  return {
    hasPermission,
    canCreate,
    canUpdate,
    canDelete,
    canRead,
    hasAction,
    hasScope,
    hasModuleAccess,
    canAccessWithScope,
    getAccessibleModules,
    getModulePermission,
    userPermissions,
    isPermissionsLoading,
  };
};
