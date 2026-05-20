import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  HistoryOutlined,
  PhoneOutlined,
  ProductOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getThemeColors } from '../../theme/colors';
import { Logo } from '../../components';
import {
  PATH_CRM,
  canViewModule,
  getRouteModule,
  isAdminUser,
} from '../../config/permissions';

import { usePermissions } from '../../hooks/usePermissions';
import { LocationEditIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
    <Link to={PATH_CRM.leads}>Leads</Link>,
    PATH_CRM.leads,
    <SolutionOutlined />
  ),

  getItem('Activities', 'submenu-activities', <CalendarOutlined />, [
    getItem(
      <Link to={PATH_CRM.activities.leads}>Leads</Link>,
      PATH_CRM.activities.leads
    ),
    // getItem(
    //   <Link to={PATH_CRM.activities.tasks}>Tasks</Link>,
    //   PATH_CRM.activities.tasks
    // ),
  ]),

  getItem('Calls', 'submenu-calls', <PhoneOutlined />, [
    getItem(<Link to={PATH_CRM.calls}>Call Logs</Link>, PATH_CRM.calls),
    getItem(
      <Link to={PATH_CRM.recordings}>Recordings</Link>,
      PATH_CRM.recordings
    ),
  ]),

  getItem(
    <Link to={PATH_CRM.products}>Products</Link>,
    PATH_CRM.products,
    <ProductOutlined />
  ),

  getItem(
    <Link to={PATH_CRM.locations}>Location</Link>,
    PATH_CRM.locations,
    <LocationEditIcon />
  ),

  getItem('Human Resource', 'group-ops', null, [], 'group'),
  //  getItem(
  //   <Link to={PATH_CRM.customers}>Customers</Link>,
  //   PATH_CRM.customers,
  //   <HistoryOutlined />
  // ),  //  getItem(
  //   <Link to={PATH_CRM.customers}>Customers</Link>,
  //   PATH_CRM.customers,
  //   <HistoryOutlined />
  // ),
  getItem(
    <Link to={PATH_CRM.hr.Attendance}>Attendance</Link>,
    PATH_CRM.hr.Attendance,
    <HistoryOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.hr.leave}>Leaves</Link>,
    PATH_CRM.hr.leave,
    <HistoryOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.hr.salarySetting}>Salary Setting</Link>,
    PATH_CRM.hr.salarySetting,
    <SettingOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.hr.payslip}>Pay Slip</Link>,
    PATH_CRM.hr.payslip,
    <SettingOutlined />
  ),

  //candidate
  getItem('Candidates', 'submenu-candidate', <BarChartOutlined />, [
    getItem(
      <Link to={PATH_CRM.hr.candidate}>Candidates</Link>,
      PATH_CRM.hr.candidate
    ),
  ]),
  getItem(
    <Link to={PATH_CRM.hr.Settings}>Configuration</Link>,
    PATH_CRM.hr.Settings,
    <SettingOutlined />
  ),

  // getItem('Reports', 'submenu-reports', <BarChartOutlined />, [
  //   getItem(
  //     <Link to={PATH_CRM.reports.overview}>Overview</Link>,
  //     PATH_CRM.reports.overview
  //   ),
  //   getItem(
  //     <Link to={PATH_CRM.reports.sales}>Sales</Link>,
  //     PATH_CRM.reports.sales
  //   ),
  //   getItem(
  //     <Link to={PATH_CRM.reports.team}>Team</Link>,
  //     PATH_CRM.reports.team
  //   ),
  // ]),

  getItem('Admin', 'group-admin', null, [], 'group'),

  getItem('Settings', 'submenu-settings', <SettingOutlined />, [
    getItem(
      <Link to={PATH_CRM.settings.users}>Staff</Link>,
      PATH_CRM.settings.users,
      <UserOutlined />
    ),
    getItem(
      <Link to={PATH_CRM.settings.roles}>Roles & Permissions</Link>,
      PATH_CRM.settings.roles,
      <SettingOutlined />
    ),
  ]),

  getItem(
    <Link to={PATH_CRM.config}>Configurations</Link>,
    PATH_CRM.config,
    <CustomerServiceOutlined />
  ),
  getItem(
    <Link to={PATH_CRM.support}>Support</Link>,
    PATH_CRM.support,
    <CustomerServiceOutlined />
  ),
];

/**
 * ✅ Role based access
 */
// type Role = 'admin' | 'manager' | 'sales' | 'support';

function filterMenuByRole(
  items: MenuProps['items'],
  userPermissions: ReturnType<typeof usePermissions>['userPermissions'],
  user: any
): MenuProps['items'] {
  const isAllowedKey = (k?: React.Key) => {
    if (typeof k !== 'string') return false;
    if (k === PATH_CRM.dashboard || isAdminUser(user)) return true;

    const module = getRouteModule(k);
    return module ? canViewModule(userPermissions, module) : false;
  };

  const walk = (list: MenuProps['items']): MenuProps['items'] => {
    if (!list) return list;

    return list
      .map((it) => {
        if (!it) return null;

        // group titles: keep only if any children visible later
        if ('type' in it && it.type === 'group') return it;

        const hasChildren =
          'children' in it &&
          Array.isArray(it.children) &&
          it.children.length > 0;
        if (!hasChildren) {
          return isAllowedKey(it?.key) ? it : null;
        }

        const children = walk('children' in it ? it.children : undefined);
        const hasAnyChild = Array.isArray(children) && children.some(Boolean);

        // keep submenu if any child is visible
        return hasAnyChild ? { ...it, children } : null;
      })
      .filter(Boolean);
  };

  // After pruning, remove empty groups
  const pruned = walk(items);

  const removeEmptyGroups = (list: MenuProps['items']) =>
    (list || []).filter((it, idx: number, arr) => {
      if (!it) return false;
      if (!('type' in it) || it.type !== 'group') return true;

      // group is kept only if there is any non-group item after it before next group
      for (let i = idx + 1; i < arr.length; i++) {
        const nextItem = arr[i];
        if (nextItem && 'type' in nextItem && nextItem.type === 'group') break;
        if (nextItem) return true;
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
  const { user } = useAuth() as any;
  const { userPermissions } = usePermissions();

  const { mytheme } = useSelector((state: RootState) => state.theme);
  const colors = getThemeColors(mytheme as 'dark' | 'light');

  const items = useMemo(
    () => filterMenuByRole(CRM_MENU_ITEMS, userPermissions, user),
    [user, userPermissions]
  );

  // Only these submenus should be "single open"
  const rootSubmenuKeys = [
    'submenu-activities',
    'submenu-calls',
    'submenu-reports',
    'submenu-candidate',
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
    else if (pathname.startsWith('/hrms/candidate'))
      setOpenKeys(['submenu-candidate']);
    else setOpenKeys([]);
  }, [pathname]);

  return (
    <Sider
      ref={nodeRef as React.Ref<HTMLDivElement>}
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
