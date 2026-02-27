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
            onClick={() => goto('/crm/activities/tasks')}
            hoverable
          >
            <Typography.Text type="secondary">Total Tasks</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={stats?.totals?.totalTasks || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/activities/tasks?status=pending')}
            hoverable
          >
            <Typography.Text type="secondary">In Progress</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={stats?.tasks?.inProgress || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/activities/tasks?status=overdue')}
            hoverable
          >
            <Typography.Text type="secondary">Overdue</Typography.Text>
            <Typography.Title level={3} style={{ color: '#ff4d4f' }}>
              <CountUp end={stats?.tasks?.overdue || 0} />
            </Typography.Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => goto('/crm/activities/tasks?status=completed')}
            hoverable
          >
            <Typography.Text type="secondary">Completed</Typography.Text>
            <Typography.Title level={3} style={{ color: '#52c41a' }}>
              <CountUp end={stats?.tasks?.completed || 0} />
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
              <Card title="Tasks by Status">
                <Column
                  data={stats?.tasks?.byStatus || []}
                  xField="status"
                  yField="count"
                  height={200}
                  color={({ status }) => {
                    const colors: any = {
                      notStarted: '#8c8c8c',
                      inProgress: '#1890ff',
                      testing: '#faad14',
                      awaitingFeedback: '#fa8c16',
                      completed: '#52c41a',
                    };
                    return colors[status] || '#1890ff';
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Task Summary">
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography.Text>Due Today</Typography.Text>
                  <Typography.Text strong>
                    {stats?.tasks?.dueToday || 0}
                  </Typography.Text>
                </div>
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography.Text type="danger">Overdue</Typography.Text>
                  <Typography.Text strong type="danger">
                    {stats?.tasks?.overdue || 0}
                  </Typography.Text>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography.Text type="success">Completed</Typography.Text>
                  <Typography.Text strong type="success">
                    {stats?.tasks?.completed || 0}
                  </Typography.Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Recent Tasks"
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
              {stats?.tasks?.recentTasks?.map((task: any) => (
                <Card
                  key={task._id}
                  size="small"
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => goto(`/activities/tasks/${task._id}`)}
                  hoverable
                >
                  <Typography.Text strong>{task.subject}</Typography.Text>
                  <br />
                  <Tag color="cyan" style={{ marginTop: '8px' }}>
                    {task.relatedTo?.type}
                  </Tag>
                  <Tag color="blue">{task.status}</Tag>
                  <Tag color="orange">{task.priority}</Tag>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px' }}
                  >
                    Assignee: {task.assignee?.firstName}{' '}
                    {task.assignee?.lastName}
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px' }}
                  >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
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
