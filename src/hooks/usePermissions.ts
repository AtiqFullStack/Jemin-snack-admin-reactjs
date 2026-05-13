import { useAuth } from '../contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { isAdminUser, PermissionObj } from '../config/permissions';
import { apiRequest } from 'src/services/api/apiClient';
import { API_ENDPOINTS } from 'src/services/api/endpoints';

export const usePermissions = () => {
  const { user } = useAuth() as any;
  const roleId = user?.roleId?._id || user?.roleId;
  const fallbackPermissions = useMemo(
    () =>
      Array.isArray(user?.roleId?.permissions) ? user.roleId.permissions : [],
    [user?.roleId?.permissions]
  );
  const [userPermissions, setUserPermissions] =
    useState<PermissionObj[]>(fallbackPermissions);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(
    !!roleId && !isAdminUser(user)
  );

  useEffect(() => {
    setUserPermissions(fallbackPermissions);

    if (!roleId || isAdminUser(user)) {
      setIsPermissionsLoading(false);
      return;
    }

    setIsPermissionsLoading(true);
    apiRequest
      .get(API_ENDPOINTS.ROLES.LIST(roleId))
      .then((res: any) => {
        const roleData = res?.data ?? res;
        const role = Array.isArray(roleData) ? roleData[0] : roleData;
        setUserPermissions(
          Array.isArray(role?.permissions) ? role.permissions : []
        );
      })
      .catch(() => {
        setUserPermissions(fallbackPermissions);
      })
      .finally(() => setIsPermissionsLoading(false));
  }, [fallbackPermissions, roleId, user]);

  // Find permission object for a module
  const getModulePermission = (module: string): PermissionObj | undefined => {
    if (isAdminUser(user)) return undefined; // Admin has all permissions
    return userPermissions.find((p) => p.module === module);
  };

  // Check if user has specific action on a module
  const hasAction = (module: string, action: string): boolean => {
    if (isAdminUser(user)) return true; // Admin has all actions
    const permission = getModulePermission(module);
    if (!permission) return false;
    return permission.actions.includes(action as any);
  };

  // Check if user has specific scope on a module
  const hasScope = (module: string, scope: string): boolean => {
    if (isAdminUser(user)) return true; // Admin has all scopes
    const permission = getModulePermission(module);
    if (!permission) return false;
    return permission.scope === scope;
  };

  // Check if user has any permission on a module
  const hasModuleAccess = (module: string): boolean => {
    if (isAdminUser(user)) return true; // Admin has access to all modules
    return !!getModulePermission(module);
  };

  // Check if user can read
  const canRead = (module: string): boolean => {
    if (isAdminUser(user)) return true;
    return hasAction(module, 'read') || hasAction(module, 'view');
  };

  // Check if user can create
  const canCreate = (module: string): boolean => {
    if (isAdminUser(user)) return true;
    return hasAction(module, 'create');
  };

  // Check if user can update
  const canUpdate = (module: string): boolean => {
    if (isAdminUser(user)) return true;
    return hasAction(module, 'update');
  };

  // Check if user can delete
  const canDelete = (module: string): boolean => {
    if (isAdminUser(user)) return true;
    return hasAction(module, 'delete');
  };

  // Check if user has permission with specific scope
  const canAccessWithScope = (
    module: string,
    action: string,
    scope: string
  ): boolean => {
    if (isAdminUser(user)) return true;
    const permission = getModulePermission(module);
    if (!permission) return false;
    return (
      permission.actions.includes(action as any) && permission.scope === scope
    );
  };

  // Get all modules user has access to
  const getAccessibleModules = (): string[] => {
    if (isAdminUser(user)) {
      // Return all available modules for admin
      return [
        'staff',
        'attendance',
        'leave',
        'salary',
        'payroll',
        'candidates',
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
    if (isAdminUser(user)) return true; // Admin has all permissions
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
