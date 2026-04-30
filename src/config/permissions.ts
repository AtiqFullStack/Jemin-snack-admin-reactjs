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

    // Candidate
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

// Permission definitions with CRUD
export const PERMISSIONS = {
  // Dashboard
  'dashboard.read': 'View Dashboard',

  // Leads
  'leads.read': 'View Leads',
  'leads.create': 'Create Leads',
  'leads.update': 'Update Leads',
  'leads.delete': 'Delete Leads',

  // Lead Activities
  'leads_activities.read': 'View Lead Activities',
  'leads_activities.create': 'Create Lead Activities',
  'leads_activities.update': 'Update Lead Activities',
  'leads_activities.delete': 'Delete Lead Activities',

  // Tasks
  'tasks.read': 'View Tasks',
  'tasks.create': 'Create Tasks',
  'tasks.update': 'Update Tasks',
  'tasks.delete': 'Delete Tasks',

  // Products
  'products.read': 'View Products',
  'products.create': 'Create Products',
  'products.update': 'Update Products',
  'products.delete': 'Delete Products',

  // Calls
  'calls.read': 'View Calls',
  'calls.delete': 'Delete Calls',

  // Recordings
  'recordings.read': 'View Recordings',
  'recordings.delete': 'Delete Recordings',

  // Location
  'locations.read': 'View Locations',

  // HR - Attendance
  'timesheet.read': 'View Attendance',
  'timesheet.create': 'Create Attendance',
  'timesheet.update': 'Update Attendance',
  'timesheet.delete': 'Delete Attendance',

  // HR - Leave
  'leave.read': 'View Leave',
  'leave.create': 'Create Leave',
  'leave.update': 'Update Leave',
  'leave.delete': 'Delete Leave',

  // HR - Salary
  'salary.read': 'View Own Salary',
  'salary.readAll': 'View All Salaries',
  'salary.create': 'Create Salary',
  'salary.update': 'Update Salary',
  'salary.delete': 'Delete Salary',

  // HR - Payslip
  'salary.payslip': 'View Payslip',
  'salary.payslip.generate': 'Generate Payslip',
  'salary.payslip.send': 'Send Payslip',

  // HR - Candidates
  'candidates.read': 'View Candidates',
  'candidates.create': 'Create Candidates',
  'candidates.update': 'Update Candidates',
  'candidates.delete': 'Delete Candidates',

  // HR - Configuration
  'hr.settings.read': 'View HR Configuration',
  'hr.settings.update': 'Update HR Configuration',

  // Reports
  'reports.read': 'View Reports',
  'reports.sales': 'View Sales Reports',
  'reports.team': 'View Team Reports',

  // Settings - Staff
  'settings.users.read': 'View Staff',
  'settings.users.create': 'Create Staff',
  'settings.users.update': 'Update Staff',
  'settings.users.delete': 'Delete Staff',

  // Settings - Roles
  'settings.roles.read': 'View Roles',
  'settings.roles.create': 'Create Roles',
  'settings.roles.update': 'Update Roles',
  'settings.roles.delete': 'Delete Roles',

  // Settings - General
  'settings.manage': 'Manage Settings',

  // Config
  'config.read': 'View Configurations',
  'config.update': 'Update Configurations',

  // Support
  'support.read': 'View Support',
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
export const ROUTE_PERMISSIONS: Record<string, any> = {
  [PATH_CRM.dashboard]: null,

  // CRM
  [PATH_CRM.leads]: 'leads.read',
  [PATH_CRM.activities.leads]: 'leads_activities.read',
  [PATH_CRM.activities.tasks]: 'tasks.read',
  [PATH_CRM.calls]: 'calls.read',
  [PATH_CRM.recordings]: 'recordings.read',
  [PATH_CRM.locations]: 'locations.read',

  // HR
  [PATH_CRM.hr.Attendance]: 'timesheet.read',
  [PATH_CRM.hr.leave]: 'leave.read',
  [PATH_CRM.hr.salarySetting]: 'salary.readAll',
  [PATH_CRM.hr.payslip]: 'salary.payslip',
  [PATH_CRM.hr.candidate]: 'candidates.read',
  [PATH_CRM.hr.Settings]: 'hr.settings.read',

  // Reports
  [PATH_CRM.reports.overview]: 'reports.read',
  [PATH_CRM.reports.sales]: 'reports.sales',
  [PATH_CRM.reports.team]: 'reports.team',

  // Settings
  [PATH_CRM.settings.users]: 'settings.users.read',
  [PATH_CRM.settings.roles]: 'settings.roles.read',
  [PATH_CRM.settings.sources]: 'settings.manage',
  [PATH_CRM.settings.integrations]: 'settings.manage',

  // Config & Support
  [PATH_CRM.config]: 'config.read',
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
  leads: 'Leads',
  leads_activities: 'Lead Activities',
  tasks: 'Tasks',
  calls: 'Calls',
  recordings: 'Recordings',
  locations: 'Location',
  timesheet: 'Attendance',
  leave: 'Leave',
  salary: 'Salary & Payslip',
  candidates: 'Candidates',
  hr: 'HR Configuration',
  reports: 'Reports',
  settings: 'Settings',
  'settings.users': 'Settings • Staff',
  'settings.roles': 'Settings • Roles',
  config: 'Configurations',
  support: 'Support',
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
