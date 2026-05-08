// Permission types
export type PermissionAction = 'read' | 'create' | 'update' | 'delete';
export type PermissionScope = 'all' | 'assigned' | 'own';

export type PermissionObj = {
  module: string;
  actions: PermissionAction[];
  scope: PermissionScope;
};

// CRM Routes
export const PATH_CRM = {
  dashboard: '/dashboards/default',
  leads: '/crm/leads',
  locations: '/crm/location',
  activities: {
    leads: '/crm/activities/leads',
    tasks: '/crm/activities/tasks',
  },
  hr: {
    Attendance: '/hrms/employeee/attendance',
    leave: '/hrms/employeee/leave',
    salarySetting: '/hrms/employeee/salarySetting',
    payslip: '/hrms/setting/payslip',
    candidate: '/hrms/candidate',
    Settings: '/hrms/setting',
  },
  calls: '/crm/calls',
  recordings: '/crm/recordings',
  products: '/crm/products',
  reports: {
    overview: '/crm/reports/overview',
    sales: '/crm/reports/sales',
    team: '/crm/reports/team',
  },
  settings: {
    users: '/crm/settings/staff',
    roles: '/crm/settings/roles',
    sources: '/crm/settings/sources',
    integrations: '/crm/settings/integrations',
  },
  support: '/crm/support',
  config: '/crm/config',
};

// Module definitions with actions
export const MODULES = {
  // HR Module
  staff: {
    label: 'Staff',
    group: 'Human Resources',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  attendance: {
    label: 'Attendance',
    group: 'Human Resources',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  leave: {
    label: 'Leave',
    group: 'Human Resources',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  salary: {
    label: 'Salary',
    group: 'Human Resources',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  payroll: {
    label: 'Payroll',
    group: 'Human Resources',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned'],
  },

  // Sales Module
  leads: {
    label: 'Leads',
    group: 'Sales',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  tasks: {
    label: 'Tasks',
    group: 'Sales',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  customers: {
    label: 'Customers',
    group: 'Sales',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned'],
  },
  deals: {
    label: 'Deals',
    group: 'Sales',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  products: {
    label: 'Products',
    group: 'Sales',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all'],
  },

  // Communication Module
  calls: {
    label: 'Calls',
    group: 'Communication',
    actions: ['read', 'create', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },
  messages: {
    label: 'Messages',
    group: 'Communication',
    actions: ['read', 'create', 'delete'],
    scopes: ['all', 'assigned', 'own'],
  },

  // Reports Module
  reports: {
    label: 'Reports',
    group: 'Analytics',
    actions: ['read'],
    scopes: ['all'],
  },

  // Settings Module
  settings: {
    label: 'Settings',
    group: 'Administration',
    actions: ['read', 'update'],
    scopes: ['all'],
  },
  roles: {
    label: 'Roles & Permissions',
    group: 'Administration',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all'],
  },
  users: {
    label: 'Users',
    group: 'Administration',
    actions: ['read', 'create', 'update', 'delete'],
    scopes: ['all'],
  },
};

// Get grouped permissions by category
export const getPermissionsGrouped = () => {
  const grouped: Record<
    string,
    {
      groupLabel: string;
      items: { key: string; label: string; module: string }[];
    }
  > = {};

  Object.entries(MODULES).forEach(([moduleKey, moduleConfig]) => {
    const groupKey = moduleConfig.group;

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        groupLabel: groupKey,
        items: [],
      };
    }

    grouped[groupKey].items.push({
      key: moduleKey,
      label: moduleConfig.label,
      module: moduleKey,
    });
  });

  return grouped;
};

// Get module config
export const getModuleConfig = (module: string) => {
  return MODULES[module as keyof typeof MODULES];
};

// Get all available scopes for a module
export const getModuleScopes = (module: string): PermissionScope[] => {
  const config = getModuleConfig(module);
  return (config?.scopes as PermissionScope[]) || ['all'];
};

// Get all available actions for a module
export const getModuleActions = (module: string): PermissionAction[] => {
  const config = getModuleConfig(module);
  return (config?.actions as PermissionAction[]) || ['read'];
};

// Helper to format permission display
export const formatPermission = (permission: PermissionObj): string => {
  const config = getModuleConfig(permission.module);
  const label = config?.label || permission.module;
  const actions = permission.actions.join(', ');
  return `${label} (${actions}) - ${permission.scope}`;
};

// Helper to get all modules
export const getAllModules = () => {
  return Object.entries(MODULES).map(([key, config]) => ({
    key,
    ...config,
  }));
};

// Helper to get modules by group
export const getModulesByGroup = (group: string) => {
  return Object.entries(MODULES)
    .filter(([_, config]) => config.group === group)
    .map(([key, config]) => ({
      key,
      ...config,
    }));
};

// Get all unique groups
export const getAllGroups = () => {
  const groups = new Set(Object.values(MODULES).map((m) => m.group));
  return Array.from(groups).sort();
};

// Helper to check route access
export const hasRouteAccess = (
  userPermissions: string[],
  route: string
): boolean => {
  // For now, allow all routes - permission check can be enhanced later
  return true;
};
