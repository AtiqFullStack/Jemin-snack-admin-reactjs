import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Col,
  ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Image,
  Row,
  Tabs,
  TabsProps,
  Tag,
  theme,
  Typography,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AppLayout } from '../app';
import { Card } from '../../components';
import { USER_PROFILE_ITEMS } from '../../constants';
import { useStylesContext } from '../../context';
import { authService } from '../../services/auth/authService';

import './styles.css';
import { imageUrl } from 'src/utils/convertor';

const { Link, Text } = Typography;

export type UserProfileData = {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone?: string;
  status?: string;
  position?: string;
  department?: string;
  avatar?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
  roleId?: {
    _id?: string;
    name?: string;
    description?: string;
    permissions?: string[];
  } | null;
};

const TAB_ITEMS: TabsProps['items'] = USER_PROFILE_ITEMS.map((item) => ({
  key: item.title,
  label: item.title,
}));

const formatValue = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : '-';
};

export const UserAccountLayout = () => {
  const {
    token: { borderRadius },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const stylesContext = useStylesContext();
  const [activeKey, setActiveKey] = useState(TAB_ITEMS[0]?.key ?? 'details');
  const [user, setUser] = useState<UserProfileData | null>(null);

  const descriptionItems = useMemo<DescriptionsProps['items']>(() => {
    const fullName =
      user?.name || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

    return [
      {
        key: 'full-name',
        label: 'Name',
        children: <span>{formatValue(fullName)}</span>,
      },
      {
        key: 'role',
        label: 'Role',
        children: user?.roleId?.name ? (
          <Tag color="blue">{user.roleId.name}</Tag>
        ) : (
          <span>-</span>
        ),
      },
      {
        key: 'email',
        label: 'Email',
        children: user?.email ? (
          <Link href={`mailto:${user.email}`}>{user.email}</Link>
        ) : (
          <span>-</span>
        ),
      },
      {
        key: 'phone',
        label: 'Phone',
        children: user?.phone ? (
          <Link href={`tel:${user.phone}`}>{user.phone}</Link>
        ) : (
          <span>-</span>
        ),
      },
      {
        key: 'department',
        label: 'Department',
        children: <span>{formatValue(user?.department)}</span>,
      },
      {
        key: 'position',
        label: 'Position',
        children: <span>{formatValue(user?.position)}</span>,
      },
      {
        key: 'status',
        label: 'Status',
        children: (
          <Tag color={user?.status === 'active' ? 'green' : 'default'}>
            {formatValue(user?.status)}
          </Tag>
        ),
      },
      {
        key: 'last-login',
        label: 'Last Login',
        children: (
          <span>
            {user?.lastLoginAt
              ? new Date(user.lastLoginAt).toLocaleString()
              : '-'}
          </span>
        ),
      },
    ];
  }, [user]);

  useEffect(() => {
    const profileDetails = async () => {
      const response = await authService.getProfile();
      setUser(response ?? null);
    };

    profileDetails();
  }, []);

  useEffect(() => {
    const key =
      TAB_ITEMS.find((item) => location.pathname.includes(item.key))?.key ||
      TAB_ITEMS[0]?.key ||
      'details';

    setActiveKey(key);
  }, [location.pathname]);

  const onChange = (key: string) => {
    navigate(key);
  };

  return (
    <AppLayout>
      <Card
        className="user-profile-card-nav card"
        actions={[
          <ConfigProvider
            key="profile-tabs"
            theme={{
              components: {
                Tabs: {
                  colorBorderSecondary: 'none',
                },
              },
            }}
          >
            <Tabs
              activeKey={activeKey}
              items={TAB_ITEMS}
              onChange={onChange}
              style={{ textTransform: 'capitalize' }}
            />
          </ConfigProvider>,
        ]}
      >
        <Row {...stylesContext?.rowProps}>
          <Col xs={24} sm={8} lg={4}>
            {user?.avatar ? (
              <Image
                src={imageUrl(user.avatar)}
                alt="user profile image"
                height="100%"
                width="100%"
                style={{ borderRadius }}
              />
            ) : (
              <div
                style={{
                  minHeight: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius,
                  background: '#f5f5f5',
                }}
              >
                <Text type="secondary">
                  <UserOutlined style={{ marginRight: 8 }} />
                  No avatar
                </Text>
              </div>
            )}
          </Col>
          <Col xs={24} sm={16} lg={20}>
            <Descriptions
              title="User Info"
              items={descriptionItems}
              column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
            />
          </Col>
        </Row>
      </Card>
      <div style={{ marginTop: '1.5rem' }}>
        <Outlet context={{ user }} />
      </div>
    </AppLayout>
  );
};
