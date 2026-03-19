/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Card, PageHeader } from '../../components';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Row,
  Slider,
  Tag,
  Typography,
} from 'antd';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import dashboaradService from '../../services/dashboaradService';
import { useAuth } from '../../hooks';
import { Column, Pie } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';

const fmtDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`;

/* ===========================
   COMPONENT
=========================== */

export const DefaultDashboardPage = () => {
  const { getDashboardStats } = dashboaradService();
  const [filterOpen, setFilterOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats().then((res: any) => setStats(res.data));
  }, []);

  const goto = (links: any) => {
    navigate(links);
  };

  return (
    <div>
      <Helmet>
        <title>CRM Dashboard | Jemini</title>
      </Helmet>

      <PageHeader
        title=""
        breadcrumbs={[
          {
            title: (
              <>
                <HomeOutlined /> home
              </>
            ),
          },
          {
            title: (
              <>
                <AppstoreOutlined /> crm
              </>
            ),
          },
          { title: 'dashboard' },
        ]}
      />

      {/* KPI SECTION */}
      <Row gutter={[16, 16]}>
        {isAdmin && (
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Typography.Text type="secondary">Total Users</Typography.Text>
              <Typography.Title level={3}>
                <CountUp end={stats?.totals?.totalUsers || 0} />
              </Typography.Title>
            </Card>
          </Col>
        )}

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/leads')}
            hoverable
          >
            <Typography.Text type="secondary">Total Leads</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={stats?.totals?.totalLeads || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/calls')}
            hoverable
          >
            <Typography.Text type="secondary">Total Calls</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={stats?.totals?.totalCalls || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/calls')}
            hoverable
          >
            <Typography.Text type="secondary">Today Calls</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={stats?.calls?.todayCalls || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/recordings')}
            hoverable
          >
            <Typography.Text type="secondary">Recordings</Typography.Text>
            <Typography.Title level={3} style={{ color: '#ff4d4f' }}>
              <CountUp end={stats?.calls?.recordingsAvailable || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/calls')}
            hoverable
          >
            <Typography.Text type="secondary">Completed Calls</Typography.Text>
            <Typography.Title level={3} style={{ color: '#52c41a' }}>
              <CountUp end={stats?.calls?.completed || 0} />
            </Typography.Title>
          </Card>
        </Col>
      </Row>

      {/* MAIN GRID */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Leads by Status">
                <Column
                  data={stats?.leads?.byStatus || []}
                  xField="status"
                  yField="count"
                  height={200}
                  color={({ status }) => {
                    const colors: any = {
                      New: '#1890ff',
                      Contacted: '#52c41a',
                      Qualified: '#722ed1',
                      Lost: '#ff4d4f',
                      Converted: '#13c2c2',
                    };
                    return colors[status] || '#1890ff';
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Leads by Source">
                <Pie
                  data={stats?.leads?.bySource || []}
                  angleField="count"
                  colorField="source"
                  height={200}
                  radius={0.8}
                  label={{ type: 'outer', content: '{name} {percentage}' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Calls by Status">
                <Column
                  data={stats?.calls?.byStatus || []}
                  xField="status"
                  yField="count"
                  height={200}
                  color={({ status }) => {
                    const colors: any = {
                      completed: '#52c41a',
                      failed: '#ff4d4f',
                      busy: '#fa8c16',
                      'no-answer': '#8c8c8c',
                    };
                    return colors[status] || '#1890ff';
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Call Summary">
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography.Text>Failed</Typography.Text>
                  <Typography.Text strong>
                    {stats?.calls?.failed || 0}
                  </Typography.Text>
                </div>
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography.Text type="warning">No Answer</Typography.Text>
                  <Typography.Text strong>
                    {stats?.calls?.noAnswer || 0}
                  </Typography.Text>
                </div>
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography.Text type="danger">Busy</Typography.Text>
                  <Typography.Text strong type="danger">
                    {stats?.calls?.busy || 0}
                  </Typography.Text>
                </div>
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography.Text>Total Duration</Typography.Text>
                  <Typography.Text strong>
                    {fmtDuration(stats?.calls?.totalDuration || 0)}
                  </Typography.Text>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography.Text type="success">Avg Duration</Typography.Text>
                  <Typography.Text strong type="success">
                    {fmtDuration(stats?.calls?.avgDuration || 0)}
                  </Typography.Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Recent Calls"
            style={{ height: '100%', maxHeight: '500px', overflow: 'hidden' }}
          >
            <div
              style={{
                height: '400px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {stats?.calls?.recentCalls?.map((call: any) => (
                <Card
                  key={call._id}
                  size="small"
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => goto('/crm/calls')}
                  hoverable
                >
                  <Typography.Text strong>
                    {call?.leadId?.name || 'Unknown Lead'}
                  </Typography.Text>
                  <br />
                  <Tag
                    color={call?.direction === 'outgoing' ? 'blue' : 'green'}
                    style={{ marginTop: '8px' }}
                  >
                    {call?.direction}
                  </Tag>
                  <Tag
                    color={
                      call?.status === 'completed'
                        ? 'success'
                        : call?.status === 'failed'
                          ? 'error'
                          : 'default'
                    }
                  >
                    {call?.status}
                  </Tag>
                  <Tag color="purple">{call?.callType}</Tag>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px' }}
                  >
                    Agent: {call?.userId?.firstName} {call?.userId?.lastName}
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px' }}
                  >
                    {call?.from} to {call?.to}
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px' }}
                  >
                    Duration: {fmtDuration(call?.duration || 0)} | Lead Status:{' '}
                    {call?.leadId?.status || 'N/A'}
                  </Typography.Text>
                </Card>
              )) || []}
            </div>
          </Card>
        </Col>
      </Row>

      {/* FILTER DRAWER */}
      <Drawer
        title="CRM Filters"
        placement="right"
        onClose={() => setFilterOpen(false)}
        open={filterOpen}
      >
        <Flex vertical gap="large">
          <DatePicker.RangePicker />
          <Slider range defaultValue={[0, 100000]} />
          <Button type="primary" block>
            Apply
          </Button>
        </Flex>
      </Drawer>
    </div>
  );
};
