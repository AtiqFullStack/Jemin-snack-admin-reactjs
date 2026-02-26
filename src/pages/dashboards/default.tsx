/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import {
  Card,
  NotificationsCard,
  PageHeader,
  TasksChartCard,
  TasksListCard,
  WeeklyActivityCard,
} from '../../components';
import {
  Button,
  Carousel,
  CarouselProps,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Row,
  Slider,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  FilterOutlined,
  PhoneOutlined,
  ThunderboltOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import dashboaradService from '../../services/dashboaradService';

const CAROUSEL_PROPS: CarouselProps = {
  slidesToShow: 1,
  slidesToScroll: 1,
};

/* ===========================
   STATIC DATA
=========================== */

const KPI_DATA = {
  newLeads: 48,
  openDeals: 21,
  todayCalls: 17,
  mtdRevenue: 325000,
};

const ACTIVITY_DATA = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 19 },
  { day: 'Wed', value: 25 },
  { day: 'Thu', value: 18 },
  { day: 'Fri', value: 30 },
  { day: 'Sat', value: 15 },
  { day: 'Sun', value: 8 },
];

const PIPELINE_DATA = [
  { day: 'Mon', value: 10, status: 'new' },
  { day: 'Tue', value: 15, status: 'qualified' },
  { day: 'Wed', value: 8, status: 'proposal' },
  { day: 'Thu', value: 20, status: 'won' },
  { day: 'Fri', value: 5, status: 'lost' },
];

const TASKS_DATA = [
  {
    id: '1',
    title: 'Call ABC Pvt Ltd',
    status: 'in progress',
  },
  {
    id: '2',
    title: 'Send proposal to TechNova',
    status: 'new',
  },
  {
    id: '3',
    title: 'Follow up with referral lead',
    status: 'new',
  },
];

const HOT_LEADS = [
  { id: '1', name: 'Ravi Kumar', company: 'ABC Pvt Ltd', score: 85 },
  { id: '2', name: 'Anjali Singh', company: 'TechNova', score: 92 },
  { id: '3', name: 'Mohit Jain', company: 'FinCorp', score: 78 },
];

const MEETINGS = [
  { id: '1', title: 'Demo with ABC Pvt Ltd', time: 'Today 3:00 PM' },
  { id: '2', title: 'Internal sales sync', time: 'Tomorrow 11:00 AM' },
];
const NOTIFICATIONS = [
  {
    id: '1',
    title: 'New lead assigned',
    message: 'Ravi Kumar assigned to you',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Deal moved to Proposal',
    message: 'TechNova deal updated',
    created_at: new Date().toISOString(),
  },
];

/* ===========================
   COMPONENT
=========================== */

export const DefaultDashboardPage = () => {
  const { getDashboardStats } = dashboaradService();

  const sliderRef1 = useRef<any>(null);
  const sliderRef2 = useRef<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    getDashboardStats().then((res) => console.log(res));
  }, []);

  return (
    <div>
      <Helmet>
        <title>CRM Dashboard | Jemini</title>
      </Helmet>

      <PageHeader
        title="CRM Dashboard"
        extra={[
          <Button
            key="filter"
            icon={<FilterOutlined />}
            onClick={() => setFilterOpen(true)}
          >
            Filters
          </Button>,
        ]}
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
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Typography.Text type="secondary">New Leads</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={KPI_DATA.newLeads} />
            </Typography.Title>
            <ThunderboltOutlined />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Typography.Text type="secondary">Open Deals</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={KPI_DATA.openDeals} />
            </Typography.Title>
            <RiseOutlined />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Typography.Text type="secondary">Today Calls</Typography.Text>
            <Typography.Title level={3}>
              <CountUp end={KPI_DATA.todayCalls} />
            </Typography.Title>
            <PhoneOutlined />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Typography.Text type="secondary">Revenue (MTD)</Typography.Text>
            <Statistic value={KPI_DATA.mtdRevenue} prefix="₹" />
          </Card>
        </Col>
      </Row>

      {/* MAIN GRID */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <WeeklyActivityCard data={ACTIVITY_DATA} />
            </Col>
            <Col xs={24} lg={12}>
              <TasksChartCard data={PIPELINE_DATA} />
            </Col>
            <Col span={24}>
              <TasksListCard data={TASKS_DATA as any} />
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={6}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Hot Leads">
                <Carousel ref={sliderRef1} {...CAROUSEL_PROPS}>
                  {HOT_LEADS.map((lead) => (
                    <Card key={lead.id} size="small">
                      <Typography.Text strong>{lead.name}</Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        {lead.company}
                      </Typography.Text>
                      <br />
                      <Tag color="blue">Score {lead.score}</Tag>
                    </Card>
                  ))}
                </Carousel>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Upcoming Meetings">
                <Carousel ref={sliderRef2} {...CAROUSEL_PROPS}>
                  {MEETINGS.map((meeting) => (
                    <Card key={meeting.id} size="small">
                      <Typography.Text strong>{meeting.title}</Typography.Text>
                      <br />
                      <Tag color="green">{meeting.time}</Tag>
                    </Card>
                  ))}
                </Carousel>
              </Card>
            </Col>

            <Col span={24}>
              <NotificationsCard data={NOTIFICATIONS as any} />
            </Col>
          </Row>
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
