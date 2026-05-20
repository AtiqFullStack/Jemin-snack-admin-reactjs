import React, { useEffect, useMemo, useState } from 'react';
import {
  UserOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import { AnimatePresence, motion } from 'framer-motion';
import { Lead } from '../../types/leads';
import {
  Tabs,
  Tag,
  Flex,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Space,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import ActivityComp from './ActivityComp';
import Tasks from './Tasks';

type TabKey =
  | 'profile'
  | 'proposals'
  | 'tasks'
  | 'attachments'
  | 'reminders'
  | 'notes'
  | 'activity';

interface HeaderTabsProps {
  lead: Lead;
  activeTab?: boolean;
}

const HeaderTabs: React.FC<HeaderTabsProps> = ({ activeTab, lead }) => {
  const displayText = (value?: string | number | null) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : '-';
    }
    return value;
  };

  const displayDate = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
  };

  const displayCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const assignedName =
    lead.assignedTo?.name ||
    [lead.assignedTo?.firstName, lead.assignedTo?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

  const items = useMemo(
    () => [
      { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
      // { key: "proposals", label: "Proposals", icon: <FileTextOutlined /> },
      // { key: 'tasks', label: 'Tasks', icon: <CheckCircleOutlined /> },
      // { key: "attachments", label: "Attachments", icon: <PaperClipOutlined /> },
      // { key: "reminders", label: "Reminders", icon: <BellOutlined /> },
      // { key: "notes", label: "Notes", icon: <FileDoneOutlined /> },
      { key: 'activity', label: 'Activity Log', icon: <BarChartOutlined /> },
    ],
    []
  );

  const order = useMemo(() => items.map((i) => i.key), [items]);

  const [activeKey, setActiveKey] = useState<TabKey>('profile');
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (activeTab) {
      setActiveKey('activity');
    }
  }, [activeTab]);
  const onChange = (nextKey: string) => {
    const prevIndex = order.indexOf(activeKey);
    const nextIndex = order.indexOf(nextKey);
    setDirection(nextIndex > prevIndex ? 1 : -1);
    setActiveKey(nextKey as TabKey);
  };

  const renderContent = () => {
    switch (activeKey) {
      case 'profile':
        return (
          <div>
            {/* Top summary row */}
            <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 14 }}>
              <Row gutter={[12, 12]} align="middle">
                <Col xs={24} md={14}>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {displayText(lead.name)}
                  </Typography.Title>

                  <Space size={10} style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`}>
                        <MailOutlined /> {lead.email}
                      </a>
                    ) : (
                      <span style={{ color: '#667085' }}>
                        <MailOutlined /> -
                      </span>
                    )}

                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`}>
                        <PhoneOutlined /> {lead.phone}
                      </a>
                    ) : (
                      <span style={{ color: '#667085' }}>
                        <PhoneOutlined /> -
                      </span>
                    )}

                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noreferrer">
                        <GlobalOutlined /> Website
                      </a>
                    ) : (
                      <span style={{ color: '#667085' }}>
                        <GlobalOutlined /> -
                      </span>
                    )}
                  </Space>
                </Col>

                <Col xs={24} md={10}>
                  <Flex gap={8} justify="flex-end" wrap>
                    <Tag style={{ padding: '4px 10px', borderRadius: 999 }}>
                      {displayText(lead.status)}
                    </Tag>
                    <Tag style={{ padding: '4px 10px', borderRadius: 999 }}>
                      {displayText(lead.source)}
                    </Tag>
                    <Tag
                      color="blue"
                      style={{ padding: '4px 10px', borderRadius: 999 }}
                    >
                      {displayText(assignedName)}
                    </Tag>
                  </Flex>
                </Col>
              </Row>

              <Divider style={{ margin: '12px 0' }} />

              {/* Quick stats */}
              <Row gutter={[12, 12]}>
                {/* <Col xs={12} md={6}>
                  <Field label="Company" value={displayText(lead.company)} />
                </Col>
                <Col xs={12} md={6}>
                  <Field label="Position" value={displayText(lead.position)} />
                </Col> */}
                <Col xs={12} md={6}>
                  <Field
                    label="Lead Value"
                    value={displayCurrency(lead.leadValue)}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Field label="Score" value={displayText(lead.score)} />
                </Col>
              </Row>
            </Card>

            {/* Details grid */}
            <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
              <Col xs={24} md={12}>
                <Card
                  title="Address"
                  style={{ borderRadius: 12 }}
                  bodyStyle={{ padding: 14 }}
                >
                  <Space
                    direction="vertical"
                    size={6}
                    style={{ width: '100%' }}
                  >
                    <Flex gap={8} align="center">
                      <EnvironmentOutlined style={{ color: '#667085' }} />
                      <Typography.Text strong>
                        {displayText(lead.address)}
                      </Typography.Text>
                    </Flex>

                    <Row gutter={[12, 12]}>
                      <Col span={12}>
                        <Field label="City" value={displayText(lead.city)} />
                      </Col>
                      <Col span={12}>
                        <Field label="State" value={displayText(lead.state)} />
                      </Col>
                      <Col span={12}>
                        <Field
                          label="Country"
                          value={displayText(lead.country)}
                        />
                      </Col>
                      <Col span={12}>
                        <Field label="Zip" value={displayText(lead.zip)} />
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="Meta"
                  style={{ borderRadius: 12 }}
                  bodyStyle={{ padding: 14 }}
                >
                  <Row gutter={[12, 12]}>
                    <Col span={12}>
                      <Field
                        label="Language"
                        value={displayText(lead.language)}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        label="Public"
                        value={lead.isPublic ? 'Yes' : 'No'}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        label="Last Contacted"
                        value={displayDate(lead.lastContactedAt)}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        label="Created At"
                        value={displayDate(lead.createdAt)}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        label="Updated At"
                        value={displayDate(lead.updatedAt)}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title="Tags & Notes"
                  style={{ borderRadius: 12 }}
                  bodyStyle={{ padding: 14 }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#667085',
                        marginBottom: 6,
                      }}
                    >
                      Tags
                    </div>
                    {lead.tags?.length ? (
                      <Flex gap={6} wrap>
                        {lead.tags.map((tag) => (
                          <Tag
                            key={tag}
                            style={{ borderRadius: 999, padding: '2px 10px' }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Flex>
                    ) : (
                      <Typography.Text type="secondary">-</Typography.Text>
                    )}
                  </div>

                  <Divider style={{ margin: '10px 0' }} />

                  <div
                    style={{ fontSize: 12, color: '#667085', marginBottom: 6 }}
                  >
                    Description
                  </div>
                  <Typography.Paragraph style={{ margin: 0, color: '#101828' }}>
                    {displayText(lead.description)}
                  </Typography.Paragraph>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case 'proposals':
        return <div style={{ color: '#667085' }}>No proposals yet.</div>;
      case 'tasks':
        return <Tasks lead={lead} />;
      case 'attachments':
        return <div style={{ color: '#667085' }}>No attachments yet.</div>;
      case 'reminders':
        return <div style={{ color: '#667085' }}>No reminders yet.</div>;
      case 'notes':
        return <div style={{ color: '#667085' }}>No notes yet.</div>;
      case 'activity':
        return <ActivityComp id={lead._id} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: '#f5f6f8',
        padding: '8px 12px',
        borderRadius: 10,
      }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={onChange}
        tabBarStyle={{ marginBottom: 0 }}
        items={items.map((t) => ({
          key: t.key,
          label: t.label,
          icon: t.icon,
        }))}
      />

      <div style={{ marginTop: 12, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeKey}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ background: '#fff', borderRadius: 10, padding: 12 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div style={{ padding: '6px 0' }}>
    <div style={{ fontSize: 12, color: '#667085', marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, color: '#101828' }}>
      {value}
    </div>
  </div>
);

export default HeaderTabs;
