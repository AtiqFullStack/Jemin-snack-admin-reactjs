import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Permission } from '../config/permissions';
import { apiRequest } from 'src/services/api/apiClient';
import { API_ENDPOINTS } from 'src/services/api/endpoints';

export const usePermissions = () => {
  const { user } = useAuth() as any;
  const roleId = user?.roleId?._id || user?.roleId;
  const [userPermissions, setUserPermissions] = useState<string[]>(
    user?.roleId?.permissions || []
  );
  console.log(roleId);
  useEffect(() => {
    if (!roleId) return;
    apiRequest
      .get(API_ENDPOINTS.ROLES.LIST(roleId))
      .then((res: any) => {
        const role = Array.isArray(res.data) ? res.data[0] : res.data;
        console.log(role);
        if (role?.permissions?.length) {
          console.log(role.permissions);
          setUserPermissions(role.permissions);
        }
      })
      .catch(() => {});
  }, [roleId]);

  const hasPermission = (permission: Permission): boolean => {
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  };

  const canCreate = (module: string): boolean =>
    hasPermission(`${module}.create` as Permission);

  const canUpdate = (module: string): boolean =>
    hasPermission(`${module}.update` as Permission);

  const canDelete = (module: string): boolean =>
    hasPermission(`${module}.delete` as Permission);

  const canRead = (module: string): boolean =>
    hasPermission(`${module}.read` as Permission);

  const customCondition = (module: string): boolean =>
    hasPermission(module as Permission);

  return {
    hasPermission,
    canCreate,
    canUpdate,
    canDelete,
    canRead,
    userPermissions,
    customCondition,
  };
};
