// Permission actions
export type PermissionAction =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage';

// Permission structure
export type Permission = `${string}.${PermissionAction}`;

// Role type
export type Role = 'admin' | 'manager' | 'sales' | 'support';

// CRM Routes
export const PATH_CRM = {
  dashboard: '/dashboards/default',
  customers: '/crm/customers',
  leads: '/crm/leads',
  contacts: '/crm/contacts',
  accounts: '/crm/accounts',
  deals: '/crm/deals',
  activities: {
    leads: '/crm/activities/leads',
    tasks: '/crm/activities/tasks',
    meetings: '/crm/activities/meetings',
    calendar: '/crm/activities/calendar',
  },
  calls: '/crm/calls',
  recordings: '/crm/recordings',
  vendors: '/crm/vendors',
  products: '/crm/products',
  reports: {
    overview: '/crm/reports/overview',
    sales: '/crm/reports/sales',
    team: '/crm/reports/team',
  },
  settings: {
    users: '/crm/settings/staff',
    roles: '/crm/settings/roles',
    pipelines: '/crm/settings/pipelines',
    sources: '/crm/settings/sources',
    integrations: '/crm/settings/integrations',
  },
  support: '/crm/support',
};

// Permission definitions with CRUD
export const PERMISSIONS = {
  // Dashboard
  'dashboard.read': 'View Dashboard',

  // Customers
  'customers.read': 'View Customers',
  'customers.create': 'Create Customers',
  'customers.update': 'Update Customers',
  'customers.delete': 'Delete Customers',

  // Leads
  'leads.read': 'View Leads',
  'leads.create': 'Create Leads',
  'leads.update': 'Update Leads',
  'leads.delete': 'Delete Leads',

  // Contacts
  'contacts.read': 'View Contacts',
  'contacts.create': 'Create Contacts',
  'contacts.update': 'Update Contacts',
  'contacts.delete': 'Delete Contacts',

  // Accounts
  'accounts.read': 'View Accounts',
  'accounts.create': 'Create Accounts',
  'accounts.update': 'Update Accounts',
  'accounts.delete': 'Delete Accounts',

  // Deals
  'deals.read': 'View Deals',
  'deals.create': 'Create Deals',
  'deals.update': 'Update Deals',
  'deals.delete': 'Delete Deals',

  // Activities
  'activities.read': 'View Activities',
  'activities.create': 'Create Activities',
  'activities.update': 'Update Activities',
  'activities.delete': 'Delete Activities',

  // Calls
  'calls.read': 'View Calls',
  'calls.create': 'Create Calls',
  'calls.update': 'Update Calls',
  'calls.delete': 'Delete Calls',

  // Vendors
  'vendors.read': 'View Vendors',
  'vendors.create': 'Create Vendors',
  'vendors.update': 'Update Vendors',
  'vendors.delete': 'Delete Vendors',

  // Products
  'products.read': 'View Products',
  'products.create': 'Create Products',
  'products.update': 'Update Products',
  'products.delete': 'Delete Products',

  // Reports
  'reports.read': 'View Reports',

  // Settings
  'settings.users.read': 'View Users',
  'settings.users.create': 'Create Users',
  'settings.users.update': 'Update Users',
  'settings.users.delete': 'Delete Users',

  'settings.roles.read': 'View Roles',
  'settings.roles.create': 'Create Roles',
  'settings.roles.update': 'Update Roles',
  'settings.roles.delete': 'Delete Roles',

  'settings.manage': 'Manage Settings',
};

// Role-based permissions
export const ROLE_PERMISSIONS: Record<Role, (Permission | 'ALL')[]> = {
  admin: ['ALL'],

  manager: [
    'dashboard.read',
    'customers.read',
    'customers.create',
    'customers.update',
    'customers.delete',
    'leads.read',
    'leads.create',
    'leads.update',
    'leads.delete',
    'contacts.read',
    'contacts.create',
    'contacts.update',
    'contacts.delete',
    'accounts.read',
    'accounts.create',
    'accounts.update',
    'deals.read',
    'deals.create',
    'deals.update',
    'activities.read',
    'activities.create',
    'activities.update',
    'calls.read',
    'calls.create',
    'vendors.read',
    'products.read',
    'products.create',
    'products.update',
    'reports.read',
    'settings.users.read',
    'settings.roles.read',
  ],

  sales: [
    'dashboard.read',
    'customers.read',
    'customers.create',
    'leads.read',
    'leads.create',
    'leads.update',
    'contacts.read',
    'contacts.create',
    'accounts.read',
    'deals.read',
    'deals.create',
    'deals.update',
    'activities.read',
    'activities.create',
    'calls.read',
    'calls.create',
    'products.read',
  ],

  support: [
    'dashboard.read',
    'customers.read',
    'contacts.read',
    'accounts.read',
    'calls.read',
    'calls.create',
  ],
};

// Route to permission mapping (make routes optional if no specific permission needed)
export const ROUTE_PERMISSIONS: Record<string, Permission | null> = {
  [PATH_CRM.dashboard]: null, // Dashboard always accessible
  [PATH_CRM.customers]: 'customers.read',
  [PATH_CRM.leads]: 'leads.read',
  [PATH_CRM.contacts]: 'contacts.read',
  [PATH_CRM.accounts]: 'accounts.read',
  [PATH_CRM.deals]: 'deals.read',
  [PATH_CRM.activities.tasks]: 'activities.read',
  [PATH_CRM.activities.meetings]: 'activities.read',
  [PATH_CRM.activities.calendar]: 'activities.read',
  [PATH_CRM.calls]: 'calls.read',
  [PATH_CRM.recordings]: 'calls.read',
  [PATH_CRM.vendors]: 'vendors.read',
  [PATH_CRM.products]: 'products.read',
  [PATH_CRM.reports.overview]: 'reports.read',
  [PATH_CRM.reports.sales]: 'reports.read',
  [PATH_CRM.reports.team]: 'reports.read',
  [PATH_CRM.settings.users]: 'settings.users.read',
  [PATH_CRM.settings.roles]: 'settings.roles.read',
  [PATH_CRM.settings.pipelines]: 'settings.manage',
  [PATH_CRM.settings.sources]: 'settings.manage',
  [PATH_CRM.settings.integrations]: 'settings.manage',
  [PATH_CRM.support]: 'support.read',
};

// Helper function to check permission from user's role object
export const hasPermission = (
  userPermissions: string[],
  permission: Permission
): boolean => {
  // Check for wildcard permission (*)
  if (userPermissions.includes('*')) return true;
  // Check for specific permission
  return userPermissions.includes(permission);
};

// Helper function to check route access from user's role object
export const hasRouteAccess = (
  userPermissions: string[],
  route: string
): boolean => {
  const permission = ROUTE_PERMISSIONS[route];
  // If no permission required for route, allow access
  if (!permission) return true;
  return hasPermission(userPermissions, permission);
};

// Get all permissions as options for select
export const getPermissionOptions = () => {
  return Object.entries(PERMISSIONS).map(([value, label]) => ({
    value,
    label,
  }));
};

// permissions.ts (add at bottom)

// Module label map (optional: better headings)
export const PERMISSION_GROUP_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  leads: 'Leads',
  contacts: 'Contacts',
  accounts: 'Accounts',
  deals: 'Deals',
  activities: 'Activities',
  calls: 'Calls',
  vendors: 'Vendors',
  products: 'Products',
  reports: 'Reports',
  settings: 'Settings',
  'settings.users': 'Settings • Users',
  'settings.roles': 'Settings • Roles',
};

// group key finder
const getGroupKey = (permissionKey: string) => {
  // examples:
  // "settings.users.read" -> "settings.users"
  // "settings.manage" -> "settings"
  // "customers.read" -> "customers"
  const parts = permissionKey.split('.');

  if (parts[0] === 'settings' && parts.length >= 3) {
    return `settings.${parts[1]}`; // settings.users / settings.roles
  }
  return parts[0]; // customers/leads/calls etc
};

export const getPermissionsGrouped = () => {
  const grouped: Record<
    string,
    {
      groupLabel: string;
      items: { key: string; label: string; action?: string }[];
    }
  > = {};

  Object.entries(PERMISSIONS).forEach(([key, label]) => {
    const groupKey = getGroupKey(key);
    const action = key.split('.').pop(); // read/create/update/delete/manage
    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        groupLabel: PERMISSION_GROUP_LABELS[groupKey] || groupKey,
        items: [],
      };
    }
    grouped[groupKey].items.push({ key, label, action });
  });

  // sort actions in CRUD order
  const actionOrder = ['read', 'create', 'update', 'delete', 'manage'];

  Object.values(grouped).forEach((g) => {
    g.items.sort(
      (a, b) =>
        actionOrder.indexOf(a.action || '') -
        actionOrder.indexOf(b.action || '')
    );
  });

  // optional: sort groups by label
  return Object.entries(grouped)
    .sort((a, b) => a[1].groupLabel.localeCompare(b[1].groupLabel))
    .reduce((acc, [k, v]) => ((acc[k] = v), acc), {} as typeof grouped);
};
