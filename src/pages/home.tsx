import { Button, Col, Flex, Image, Row, theme, Typography, Tag } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import {
  PhoneOutlined,
  TeamOutlined,
  FunnelPlotOutlined,
  FileTextOutlined,
  SolutionOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  RocketFilled,
  LoginOutlined,
} from '@ant-design/icons';
import { Card, Container } from '../components';
import { createElement, CSSProperties } from 'react';
import { PATH_AUTH, PATH_DASHBOARD } from '../constants';

const { Title, Text } = Typography;

// ✅ Jemini modules (replace links with your actual routes)
const MODULES = [
  {
    title: 'Leads',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.leads
    image: '/showcase/jemini/leads.png',
  },
  {
    title: 'Customers',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.customers
    image: '/showcase/jemini/customers.png',
  },
  {
    title: 'Calls & Recordings',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.calls
    image: '/showcase/jemini/calls.png',
  },
  {
    title: 'Deals / Pipeline',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.pipeline
    image: '/showcase/jemini/pipeline.png',
  },
  {
    title: 'Tasks & Follow-ups',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.tasks
    image: '/showcase/jemini/tasks.png',
  },
  {
    title: 'Contracts',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.contracts
    image: '/showcase/jemini/contracts.png',
  },
  {
    title: 'Vendors & Visits',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.vendors
    image: '/showcase/jemini/vendors.png',
  },
  {
    title: 'Reports',
    link: PATH_DASHBOARD.default, // change to PATH_DASHBOARD.reports
    image: '/showcase/jemini/reports.png',
  },
];

const FEATURES = [
  {
    title: 'Call logging + recording',
    description:
      'Sales team calls get logged automatically with notes and recordings (as per permissions).',
    icon: PhoneOutlined,
  },
  {
    title: 'Lead → customer journey',
    description:
      'Track every lead from first contact to conversion with complete activity history.',
    icon: FunnelPlotOutlined,
  },
  {
    title: 'Sales pipeline',
    description:
      'Stage-wise deal management with expected value, close date, and probability.',
    icon: SolutionOutlined,
  },
  {
    title: 'Tasks & reminders',
    description:
      'Follow-ups never slip — assign tasks, set reminders, and track completion.',
    icon: ClockCircleOutlined,
  },
  {
    title: 'Contracts & documents',
    description:
      'Central place for contracts, quotations, and customer documents with version control.',
    icon: FileTextOutlined,
  },
  {
    title: 'Roles & permissions',
    description:
      'Control access per role (Admin, Sales, Manager, etc.) and keep data secure.',
    icon: SafetyCertificateOutlined,
  },
  {
    title: 'Teams & performance',
    description:
      'Monitor individual/team performance: calls, meetings, conversions, revenue.',
    icon: TeamOutlined,
  },
  {
    title: 'Analytics & reports',
    description:
      'Daily/weekly/monthly dashboards for management and operations.',
    icon: BarChartOutlined,
  },
];

export const HomePage = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const isMobile = useMediaQuery({ maxWidth: 769 });
  const isTablet = useMediaQuery({ maxWidth: 992 });

  const sectionStyles: CSSProperties = {
    paddingTop: isMobile ? 40 : 80,
    paddingBottom: isMobile ? 40 : 80,
    paddingRight: isMobile ? '1rem' : 0,
    paddingLeft: isMobile ? '1rem' : 0,
  };

  return (
    <div
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      {/* HERO */}
      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          height: isTablet ? 620 : 820,
          width: '100%',
          padding: isMobile ? '2rem 1rem' : '5rem 0',
        }}
      >
        <Container>
          <Row style={{ alignItems: 'center' }} gutter={[24, 24]}>
            <Col lg={12}>
              <Flex align="center" gap={10} style={{ marginBottom: 10 }}>
                <Tag color="blue">Jemini CRM</Tag>
                <Text
                  style={{ color: colorPrimary, fontSize: 14, fontWeight: 700 }}
                >
                  <RocketFilled /> Built for sales teams who sell on calls
                </Text>
              </Flex>

              <Title
                style={{
                  fontSize: isMobile ? 34 : 44,
                  fontWeight: 900,
                  margin: '0.75rem 0 1rem',
                  lineHeight: 1.1,
                }}
              >
                Manage <span className="text-highlight">Leads</span>, track{' '}
                <span className="text-highlight">Calls</span>, and close more{' '}
                <span className="text-highlight">Deals</span> — in one CRM
              </Title>

              <Text style={{ fontSize: isMobile ? 16 : 18, display: 'block' }}>
                Jemini helps your team handle vendors, customers, contracts,
                follow-ups, and call recordings with role-based access and clean
                reporting.
              </Text>

              <Flex
                gap="middle"
                vertical={isMobile}
                style={{ marginTop: '1.5rem' }}
              >
                <Link to={PATH_AUTH.signin}>
                  <Button
                    icon={<LoginOutlined />}
                    type="primary"
                    size="large"
                    block={isMobile}
                  >
                    Login to Jemini
                  </Button>
                </Link>
              </Flex>

              <Flex gap={10} wrap style={{ marginTop: 18 }}>
                <Tag>Call Recording</Tag>
                <Tag>Pipeline</Tag>
                <Tag>Tasks</Tag>
                <Tag>Contracts</Tag>
                <Tag>Reports</Tag>
              </Flex>
            </Col>

            {!isTablet && (
              <Col lg={12}>
                {/* Replace with your actual CRM screenshot */}
                <Image
                  preview={false}
                  src="https://as2.ftcdn.net/v2/jpg/17/70/20/35/1000_F_1770203548_zg5rzJ9jOVk1Ylc4W3GKUhxCA1zZwNox.jpg"
                  alt="Jemini CRM dashboard"
                  style={{ borderRadius: 12 }}
                />
              </Col>
            )}
          </Row>
        </Container>
      </Flex>

      {/* MODULES */}
      <Container style={sectionStyles}>
        <Title
          level={2}
          className="text-center"
          style={{ marginBottom: '2rem' }}
        >
          Everything your sales team needs
        </Title>

        <Row
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
        >
          {MODULES.map((m) => (
            <Col key={m.title} xs={24} sm={12} lg={8} xl={6}>
              <Link to={m.link}>
                <Card hoverable cover={<img src={m.image} alt={m.title} />}>
                  <Text className="m-0 text-capitalize">{m.title}</Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <Flex justify="center" style={{ marginTop: 24 }}>
          <Link to={PATH_AUTH.signin}>
            <Button type="primary" size="large">
              Get Started
            </Button>
          </Link>
        </Flex>
      </Container>

      {/* FEATURES */}
      <Container style={sectionStyles}>
        <Title
          level={2}
          className="text-center"
          style={{ marginBottom: '2rem' }}
        >
          Built for real-world selling
        </Title>

        <Row
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
        >
          {FEATURES.map((feature) => (
            <Col key={feature.title} xs={24} md={12} lg={8}>
              <Card style={{ height: '100%' }}>
                <Flex vertical gap={6}>
                  {createElement(feature.icon, {
                    style: { fontSize: 32, color: colorPrimary },
                  })}
                  <Title
                    level={5}
                    className="text-capitalize"
                    style={{ marginBottom: 0 }}
                  >
                    {feature.title}
                  </Title>
                  <Text>{feature.description}</Text>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA */}
      <Card
        style={{
          width: isMobile ? '95%' : 560,
          margin: '0 auto 80px',
          textAlign: 'center',
        }}
      >
        <Title level={4} style={{ marginTop: 0 }}>
          Want Jemini CRM for your team?
        </Title>
        <Text style={{ marginTop: '1rem', display: 'block' }}>
          Share your requirements — we’ll help you configure roles, pipeline,
          and call recording.
        </Text>

        <Flex gap="middle" justify="center" style={{ marginTop: '1rem' }} wrap>
          <Button href="mailto:support@jeminicrm.com" type="primary">
            Contact Support
          </Button>
          <Link to={PATH_AUTH.signin}>
            <Button>Login</Button>
          </Link>
        </Flex>
      </Card>
    </div>
  );
};
