import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  PhoneOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getThemeColors } from '../../theme/colors';
import { Logo } from '../../components';

/**
 * ✅ Replace these with your actual route constants
 */
const PATH_CRM = {
  dashboard: '/dashboards/default',
  customers: '/crm/customers',
  leads: '/crm/leads',
  contacts: '/crm/contacts',
  accounts: '/crm/accounts', // companies/customers
  deals: '/crm/deals', // opportunities
  activities: {
    tasks: '/crm/activities/tasks',
    meetings: '/crm/activities/meetings',
    calendar: '/crm/activities/calendar',
  },
  calls: '/crm/calls', // call logs
  recordings: '/crm/recordings', // call recordings
  vendors: '/crm/vendors',
  products: '/crm/products',
  reports: {
    overview: '/crm/reports/overview',
    sales: '/crm/reports/sales',
    team: '/crm/reports/team',
  },
  settings: {
    users: '/crm/settings/users',
    roles: '/crm/settings/roles',
    pipelines: '/crm/settings/pipelines',
    sources: '/crm/settings/sources',
    integrations: '/crm/settings/integrations',
  },
  support: '/crm/support',
};

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => ({ key, icon, children, label, type }) as MenuItem;

/**
 * ✅ Jemini CRM base menu
 * Keys intentionally match routes for easy selectedKeys handling
 */
const CRM_MENU_ITEMS: MenuProps['items'] = [
  getItem(
    <Link to={PATH_CRM.dashboard}>Dashboard</Link>,
    PATH_CRM.dashboard,
    <AppstoreOutlined />
  ),

  getItem('Sales', 'group-sales', null, [], 'group'),

  getItem(
    <Link to={PATH_CRM.customers}>Customers</Link>,
    PATH_CRM.customers,
    <UserOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.leads}>Leads</Link>,
    PATH_CRM.leads,
    <SolutionOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.contacts}>Contacts</Link>,
    PATH_CRM.contacts,
    <TeamOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.accounts}>Accounts / Companies</Link>,
    PATH_CRM.accounts,
    <ShopOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.deals}>Deals / Opportunities</Link>,
    PATH_CRM.deals,
    <FileTextOutlined />
  ),

  getItem('Activities', 'submenu-activities', <CalendarOutlined />, [
    getItem(
      <Link to={PATH_CRM.activities.tasks}>Tasks</Link>,
      PATH_CRM.activities.tasks
    ),
    getItem(
      <Link to={PATH_CRM.activities.meetings}>Meetings</Link>,
      PATH_CRM.activities.meetings
    ),
    getItem(
      <Link to={PATH_CRM.activities.calendar}>Calendar</Link>,
      PATH_CRM.activities.calendar
    ),
  ]),

  getItem('Calls', 'submenu-calls', <PhoneOutlined />, [
    getItem(<Link to={PATH_CRM.calls}>Call Logs</Link>, PATH_CRM.calls),
    getItem(
      <Link to={PATH_CRM.recordings}>Recordings</Link>,
      PATH_CRM.recordings
    ),
  ]),

  getItem('Operations', 'group-ops', null, [], 'group'),

  getItem(
    <Link to={PATH_CRM.vendors}>Vendors</Link>,
    PATH_CRM.vendors,
    <ShoppingOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.products}>Products</Link>,
    PATH_CRM.products,
    <ShoppingOutlined />
  ),

  getItem('Reports', 'submenu-reports', <BarChartOutlined />, [
    getItem(
      <Link to={PATH_CRM.reports.overview}>Overview</Link>,
      PATH_CRM.reports.overview
    ),
    getItem(
      <Link to={PATH_CRM.reports.sales}>Sales</Link>,
      PATH_CRM.reports.sales
    ),
    getItem(
      <Link to={PATH_CRM.reports.team}>Team</Link>,
      PATH_CRM.reports.team
    ),
  ]),

  getItem('Admin', 'group-admin', null, [], 'group'),

  getItem('Settings', 'submenu-settings', <SettingOutlined />, [
    getItem(
      <Link to={PATH_CRM.settings.users}>Users</Link>,
      PATH_CRM.settings.users,
      <UserOutlined />
    ),
    getItem(
      <Link to={PATH_CRM.settings.roles}>Roles & Permissions</Link>,
      PATH_CRM.settings.roles,
      <SettingOutlined />
    ),
    getItem(
      <Link to={PATH_CRM.settings.pipelines}>Pipelines</Link>,
      PATH_CRM.settings.pipelines,
      <FileTextOutlined />
    ),
    getItem(
      <Link to={PATH_CRM.settings.sources}>Lead Sources</Link>,
      PATH_CRM.settings.sources,
      <AppstoreOutlined />
    ),
    getItem(
      <Link to={PATH_CRM.settings.integrations}>Integrations</Link>,
      PATH_CRM.settings.integrations,
      <AppstoreOutlined />
    ),
  ]),

  getItem(
    <Link to={PATH_CRM.support}>Support</Link>,
    PATH_CRM.support,
    <CustomerServiceOutlined />
  ),
];

/**
 * ✅ Role based access
 * Replace roles with your backend roles if different
 */
type Role = 'admin' | 'manager' | 'sales' | 'support';

const ROLE_ALLOWED_KEYS: Record<Role, (string | 'ALL')[]> = {
  admin: ['ALL'],
  manager: [
    PATH_CRM.dashboard,
    PATH_CRM.customers,
    PATH_CRM.leads,
    PATH_CRM.contacts,
    PATH_CRM.accounts,
    PATH_CRM.deals,
    PATH_CRM.activities.tasks,
    PATH_CRM.activities.meetings,
    PATH_CRM.activities.calendar,
    PATH_CRM.calls,
    PATH_CRM.recordings,
    PATH_CRM.vendors,
    PATH_CRM.products,
    PATH_CRM.reports.overview,
    PATH_CRM.reports.sales,
    PATH_CRM.reports.team,
    PATH_CRM.support,
  ],
  sales: [
    PATH_CRM.dashboard,
    PATH_CRM.customers,
    PATH_CRM.leads,
    PATH_CRM.contacts,
    PATH_CRM.accounts,
    PATH_CRM.deals,
    PATH_CRM.activities.tasks,
    PATH_CRM.activities.meetings,
    PATH_CRM.activities.calendar,
    PATH_CRM.calls,
    PATH_CRM.recordings,
    PATH_CRM.products,
    PATH_CRM.support,
  ],
  support: [
    PATH_CRM.dashboard,
    PATH_CRM.customers,
    PATH_CRM.contacts,
    PATH_CRM.accounts,
    PATH_CRM.calls,
    PATH_CRM.recordings,
    PATH_CRM.support,
  ],
};

function filterMenuByRole(
  items: MenuProps['items'],
  role: Role
): MenuProps['items'] {
  const allowed = ROLE_ALLOWED_KEYS[role] || [];
  if (allowed.includes('ALL')) return items;

  const isAllowedKey = (k?: React.Key) =>
    typeof k === 'string' ? allowed.includes(k) : false;

  const walk = (list: MenuProps['items']): MenuProps['items'] => {
    if (!list) return list;

    return list
      .map((it: MenuItem) => {
        if (!it) return null;

        // group titles: keep only if any children visible later
        if (it.type === 'group') return it;

        const hasChildren =
          Array.isArray(it.children) && it.children.length > 0;
        if (!hasChildren) {
          return isAllowedKey(it.key) ? it : null;
        }

        const children = walk(it.children);
        const hasAnyChild = Array.isArray(children) && children.some(Boolean);

        // keep submenu if any child is visible
        return hasAnyChild ? { ...it, children } : null;
      })
      .filter(Boolean);
  };

  // After pruning, remove empty groups
  const pruned = walk(items);

  const removeEmptyGroups = (list: MenuProps['items']) =>
    (list || []).filter((it: MenuItem, idx: number, arr: MenuItem[]) => {
      if (!it) return false;
      if (it.type !== 'group') return true;

      // group is kept only if there is any non-group item after it before next group
      for (let i = idx + 1; i < arr.length; i++) {
        if (arr[i]?.type === 'group') break;
        if (arr[i]) return true;
      }
      return false;
    });

  return removeEmptyGroups(pruned);
}

type SideNavProps = SiderProps;

const SideNav = ({ ...others }: SideNavProps) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');

  const { mytheme } = useSelector((state: RootState) => state.theme);
  const colors = getThemeColors(mytheme as 'dark' | 'light');

  // ✅ assume auth state
  const role = (useSelector(
    (state: RootState) => (state as Record<string, unknown>)?.auth?.user?.role
  ) || 'sales') as Role;

  const items = useMemo(() => filterMenuByRole(CRM_MENU_ITEMS, role), [role]);

  // Only these submenus should be "single open"
  const rootSubmenuKeys = [
    'submenu-activities',
    'submenu-calls',
    'submenu-reports',
    'submenu-settings',
  ];

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find(
      (key) => openKeys.indexOf(key as string) === -1
    ) as string | undefined;

    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys as string[]);
      return;
    }
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  useEffect(() => {
    setCurrent(pathname);

    // auto expand based on route
    if (pathname.startsWith('/crm/activities'))
      setOpenKeys(['submenu-activities']);
    else if (
      pathname.startsWith('/crm/calls') ||
      pathname.startsWith('/crm/recordings')
    )
      setOpenKeys(['submenu-calls']);
    else if (pathname.startsWith('/crm/reports'))
      setOpenKeys(['submenu-reports']);
    else if (pathname.startsWith('/crm/settings'))
      setOpenKeys(['submenu-settings']);
    else setOpenKeys([]);
  }, [pathname]);

  return (
    <Sider
      ref={nodeRef as React.Ref<HTMLElement>}
      breakpoint="lg"
      collapsedWidth="0"
      {...others}
    >
      <Logo
        color="blue"
        asLink
        href="/"
        justify="center"
        gap="small"
        imgSize={{ h: 28, w: 28 }}
        style={{ padding: '1rem 0' }}
      />

      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'none',
              itemSelectedBg: colors[100],
              itemHoverBg: colors[50],
              itemSelectedColor: colors[600],
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={items}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[current]}
          style={{ border: 'none' }}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default SideNav;
