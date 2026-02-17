import React, { useMemo, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Table,
  Tag,
  Button,
  Flex,
  Input,
  Select,
  Typography,
  Modal,
  Form,
  Divider,
  Checkbox,
} from 'antd';
import { PlusOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../components';

type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Won'
  | 'Lost';

type LeadSource = 'Facebook' | 'Referral' | 'Website' | 'Walk-in' | 'Instagram';
type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Won'
  | 'Lost';

type LeadFormValues = {
  status: LeadStatus;
  source: LeadSource;
  assigned: string;
  tags?: string[];

  name: string;
  position?: string;
  email?: string;
  website?: string;
  phone?: string;
  lead_value?: number;
  company?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  language?: string;

  description?: string;
  is_public?: boolean;
  contacted_today?: boolean;
};

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  stage: LeadStage;
  owner: string;
  score: number;
  created_at: string;
};

const STAGE_COLOR: Record<LeadStage, string> = {
  New: 'default',
  Contacted: 'blue',
  Qualified: 'geekblue',
  Proposal: 'gold',
  Won: 'green',
  Lost: 'red',
};

const STATIC_LEADS: Lead[] = [
  {
    id: 'L-1001',
    first_name: 'Ravi',
    last_name: 'Kumar',
    email: 'ravi.kumar@example.com',
    phone: '+91 98765 43210',
    company: 'ABC Pvt Ltd',
    source: 'Referral',
    stage: 'New',
    owner: 'You',
    score: 85,
    created_at: '2026-02-16',
  },
];

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>(STATIC_LEADS);
  const [q, setQ] = useState('');
  const [stage, setStage] = useState<LeadStage | undefined>();
  const [source, setSource] = useState<LeadSource | undefined>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<LeadFormValues>();

  // dropdown add option state
  const [statusOptions, setStatusOptions] = useState<LeadStatus[]>([
    'New',
    'Contacted',
    'Qualified',
    'Proposal',
    'Won',
    'Lost',
  ]);
  const [sourceOptions, setSourceOptions] = useState<LeadSource[]>([
    'Facebook',
    'Referral',
    'Website',
    'Walk-in',
    'Instagram',
  ]);
  const [newStatus, setNewStatus] = useState('');
  const [newSource, setNewSource] = useState('');

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const search = q.trim().toLowerCase();
      const matchesSearch =
        !search ||
        `${l.first_name} ${l.last_name}`.toLowerCase().includes(search) ||
        l.company.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        l.phone.toLowerCase().includes(search);

      const matchesStage = !stage || l.stage === stage;
      const matchesSource = !source || l.source === source;

      return matchesSearch && matchesStage && matchesSource;
    });
  }, [q, stage, source, leads]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      status: 'New',
      assigned: 'admin user',
      language: 'System Default',
      contacted_today: true,
      is_public: false,
      tags: [],
    });
  };

  const handleSaveLead = async () => {
    const values = await form.validateFields();

    // Split name into first/last (simple)
    const parts = (values.name || '').trim().split(' ');
    const first_name = parts[0] || '—';
    const last_name = parts.slice(1).join(' ') || '';

    const newLead: Lead = {
      id: `L-${1000 + leads.length + 1}`,
      first_name,
      last_name,
      email: values.email || '—',
      phone: values.phone || '—',
      company: values.company || '—',
      source: values.source,
      stage: (values.status as LeadStage) || 'New',
      owner: values.assigned || 'admin user',
      score: 50,
      created_at: new Date().toISOString().split('T')[0],
    };

    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Lead',
      dataIndex: 'first_name',
      key: 'lead',
      render: (_: unknown, row: Lead) => (
        <Flex align="center" gap={10}>
          <UserAvatar fullName={`${row.first_name} ${row.last_name}`} />
          <div>
            <Typography.Text strong>
              {row.first_name} {row.last_name}
            </Typography.Text>
            <div>
              <Typography.Text type="secondary">{row.company}</Typography.Text>
            </div>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'email',
      key: 'contact',
      render: (_: unknown, row: Lead) => (
        <Flex vertical gap={2}>
          <Link to={`mailto:${row.email}`}>{row.email}</Link>
          <a href={`tel:${row.phone}`}>
            <PhoneOutlined /> {row.phone}
          </a>
        </Flex>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (v: LeadSource) => <Tag>{v}</Tag>,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (v: LeadStage) => <Tag color={STAGE_COLOR[v]}>{v}</Tag>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at' },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Leads"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
              >
                Add Lead
              </Button>
            }
          >
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
              <Col xs={24} md={10}>
                <Input
                  placeholder="Search by name, company, email, phone..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  allowClear
                />
              </Col>

              <Col xs={24} md={7}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Filter by stage"
                  allowClear
                  value={stage}
                  onChange={(v) => setStage(v)}
                  options={statusOptions.map((s) => ({ value: s, label: s }))}
                />
              </Col>

              <Col xs={24} md={7}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Filter by source"
                  allowClear
                  value={source}
                  onChange={(v) => setSource(v)}
                  options={sourceOptions.map((s) => ({ value: s, label: s }))}
                />
              </Col>
            </Row>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 8 }}
              className="overflow-scroll"
              rowHoverable={false}
            />
          </Card>
        </Col>
      </Row>

      {/* ✅ Screenshot-like Modal */}
      <Modal
        title="Add New lead"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
            }}
          >
            Close
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveLead}>
            Save
          </Button>,
        ]}
        width={900}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          {/* Top row: Status, Source, Assigned */}
          <Row gutter={[12, 12]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="status"
                label={
                  <>
                    <span style={{ color: 'red' }}>*</span> Status
                  </>
                }
                rules={[{ required: true, message: 'Status required' }]}
              >
                <Select
                  placeholder="Nothing selected"
                  options={statusOptions.map((s) => ({ value: s, label: s }))}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Flex gap={8} style={{ padding: 8 }}>
                        <Input
                          placeholder="Add new status"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const v = newStatus.trim();
                            if (!v) return;
                            if (!statusOptions.includes(v as LeadStatus)) {
                              setStatusOptions((prev) => [
                                ...prev,
                                v as LeadStatus,
                              ]);
                            }
                            form.setFieldValue('status', v as LeadStatus);
                            setNewStatus('');
                          }}
                        />
                      </Flex>
                    </div>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="source"
                label={
                  <>
                    <span style={{ color: 'red' }}>*</span> Source
                  </>
                }
                rules={[{ required: true, message: 'Source required' }]}
              >
                <Select
                  placeholder="Nothing selected"
                  options={sourceOptions.map((s) => ({ value: s, label: s }))}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Flex gap={8} style={{ padding: 8 }}>
                        <Input
                          placeholder="Add new source"
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value)}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const v = newSource.trim();
                            if (!v) return;
                            if (!sourceOptions.includes(v as LeadSource)) {
                              setSourceOptions((prev) => [
                                ...prev,
                                v as LeadSource,
                              ]);
                            }
                            form.setFieldValue('source', v as LeadSource);
                            setNewSource('');
                          }}
                        />
                      </Flex>
                    </div>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="assigned"
                label="Assigned"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'admin user', label: 'admin user' },
                    { value: 'sales user', label: 'sales user' },
                    { value: 'manager', label: 'manager' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Tags */}
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Add tags"
                  tokenSeparators={[',']}
                  options={[
                    { value: 'hot', label: 'hot' },
                    { value: 'followup', label: 'followup' },
                    { value: 'priority', label: 'priority' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Main form 2 columns */}
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label={
                  <>
                    <span style={{ color: 'red' }}>*</span> Name
                  </>
                }
                rules={[{ required: true, message: 'Name required' }]}
              >
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="position" label="Position">
                <Input placeholder="" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ type: 'email', message: 'Invalid email' }]}
              >
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="website" label="Website">
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="lead_value" label="Lead value">
                <Input type="number" addonAfter="$" placeholder="" />
              </Form.Item>

              <Form.Item name="company" label="Company">
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="address" label="Address">
                <Input.TextArea rows={2} placeholder="" />
              </Form.Item>

              <Form.Item name="city" label="City">
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="state" label="State">
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="country" label="Country">
                <Select
                  placeholder="Nothing selected"
                  options={[
                    { value: 'India', label: 'India' },
                    { value: 'USA', label: 'USA' },
                    { value: 'UAE', label: 'UAE' },
                  ]}
                />
              </Form.Item>

              <Form.Item name="zip" label="Zip Code">
                <Input placeholder="" />
              </Form.Item>

              <Form.Item name="language" label="Default Language">
                <Select
                  options={[
                    { value: 'System Default', label: 'System Default' },
                    { value: 'English', label: 'English' },
                    { value: 'Hindi', label: 'Hindi' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Description */}
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          {/* Bottom checkboxes */}
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Flex gap={16} align="center">
                <Form.Item
                  name="is_public"
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox>Public</Checkbox>
                </Form.Item>

                <Form.Item
                  name="contacted_today"
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox>Contacted Today</Checkbox>
                </Form.Item>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadsPage;
