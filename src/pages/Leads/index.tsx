import { useMemo, useState, useEffect } from 'react';
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
  Drawer,
  Form,
  Divider,
  Checkbox,
  Space,
  Modal,
  message,
} from 'antd';
import {
  PlusOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../components';
import leadServices from '../../services/leadServices';
import staffService from '../../services/staffService';
import { timeConverter } from '../../utils/convertor';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { fetchCountries } from '../../redux/countriesSlice';

import {
  LeadStage,
  LeadSource,
  LeadStatus,
  LeadFormValues,
  Lead,
} from '../../types/leads';
import LeadViewModal from './LeadViewModal';
import { usePermissions } from '../../hooks/usePermissions';

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [q, setQ] = useState('');
  const [stage, setStage] = useState<LeadStage | undefined>();
  const [source, setSource] = useState<LeadSource | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [form] = Form.useForm<LeadFormValues>();
  const [staffs, setStaffs] = useState([]);
  const {} = usePermissions();

  const { creatLeads, getLeads, deleteLeads, updateLeads } = leadServices();
  const { getStaff } = staffService();
  const dispatch = useDispatch<AppDispatch>();
  const countries = useSelector((state: any) => state.countries.countries);
  const { canCreate, canUpdate, canDelete } = usePermissions();

  useEffect(() => {
    fetchLeads();
    dispatch(fetchCountries());
    getStaff().then((res: any) => {
      if (res.success) {
        console.log(res.data);
        if (res.data.items && res.data.items.length) {
          const options = res.data.items.map((r: any) => {
            return {
              value: r._id,
              label: r.firstName + ' ' + r.lastName,
            };
          }) as any;
          setStaffs(options);
        }
      }
    });
  }, [dispatch]);

  const fetchLeads = async () => {
    const res = (await getLeads()) as any;
    if (res.success) {
      setLeads(res.data);
    }
  };

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
        l.name.toLowerCase().includes(search) ||
        l.company.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        l.phone.toLowerCase().includes(search);

      const matchesStage = !stage || l.status === stage;
      const matchesSource = !source || l.source === source;

      return matchesSearch && matchesStage && matchesSource;
    });
  }, [q, stage, source, leads]);

  const handleOpenDrawer = () => {
    setEditingLead(null);
    setIsDrawerOpen(true);
    form.resetFields();
    form.setFieldsValue({
      status: 'New',
      language: 'System Default',
      contacted_today: true,
      is_public: false,
      tags: [],
    });
  };

  const handleEdit = (record: Lead) => {
    setEditingLead(record);
    form.setFieldsValue({
      status: record.status,
      source: record.source,
      assigned: record.assignedTo?._id,
      name: record.name,
      position: record.position,
      email: record.email,
      website: record.website,
      phone: record.phone,
      lead_value: record.leadValue,
      company: record.company,
      tags: record.tags,
      address: record.address,
      city: record.city,
      state: record.state,
      country: record.country,
      zip: record.zip,
      language: record.language,
      description: record.description,
      is_public: record.isPublic,
      contacted_today: !!record.lastContactedAt,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = (record: Lead) => {
    Modal.confirm({
      title: 'Delete Lead',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const res = (await deleteLeads(record._id)) as any;
        if (res.success) {
          message.success(res.message);
          await fetchLeads();
        }
        // Call delete API here
      },
    });
  };

  const handleSaveLead = async () => {
    const values = await form.validateFields();

    const payload = {
      status: values.status,
      source: values.source,
      assignedTo: values.assigned,
      name: values.name,
      position: values.position,
      email: values.email,
      website: values.website,
      phone: values.phone,
      leadValue: values.lead_value,
      company: values.company,
      tags: values.tags,
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
      zip: values.zip,
      language: values.language,
      description: values.description,
      isPublic: values.is_public,
      contacted_today: values.contacted_today,
    };

    let res;
    if (editingLead) {
      res = (await updateLeads(editingLead._id, payload)) as any;
    } else {
      res = (await creatLeads(payload)) as any;
    }

    if (res.success) {
      message.success(
        res.message ||
          (editingLead
            ? 'Lead updated successfully'
            : 'Lead created successfully')
      );
      await fetchLeads();
      setIsDrawerOpen(false);
      form.resetFields();
    } else {
      message.error(
        res?.message ||
          (editingLead ? 'Failed to update lead' : 'Failed to create lead')
      );
    }
  };

  const columns = [
    {
      title: 'Name/Company',
      dataIndex: 'first_name',
      key: 'name',
      render: (_: unknown, row: Lead) => (
        <Flex align="center" gap={10} style={{ cursor: 'pointer' }}>
          <div>
            <UserAvatar fullName={row?.name} />
            <Typography.Text style={{ marginLeft: 30 }} type="secondary">
              {row.company}
            </Typography.Text>
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
      title: 'Value',
      dataIndex: 'leadValue',
      key: 'leadValue',
      render: (v: LeadSource) => <Tag>{v}</Tag>,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (v: any) => (
        <Flex gap={2}>
          {v.length && v.map((tag: any) => <Tag key={tag}>{tag}</Tag>)}
        </Flex>
      ),
    },

    {
      title: 'Assigned',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (v: any) => <Tag color="blue">{v?.name}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: any) => timeConverter(v),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Lead) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setViewLead(record)}
          />
          {canUpdate('leads.update') && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          )}
          {canDelete('leads.delete') && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <LeadViewModal
        open={!!viewLead}
        lead={viewLead}
        onClose={() => setViewLead(null)}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Leads"
            extra={
              canCreate('leads.create') && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenDrawer}
                >
                  Add Lead
                </Button>
              )
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

      <Drawer
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingLead(null);
          form.resetFields();
        }}
        width={900}
        placement="right"
        extra={
          <Space>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
                setEditingLead(null);
                form.resetFields();
              }}
            >
              Close
            </Button>
            <Button type="primary" onClick={handleSaveLead}>
              {editingLead ? 'Update' : 'Save'}
            </Button>
          </Space>
        }
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
                <Select options={staffs} />
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
                  showSearch
                  placeholder="Nothing selected"
                  filterOption={(input, option) =>
                    String(option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={countries.map((c: any) => ({
                    value: c.name.common,
                    label: c.name.common,
                  }))}
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
      </Drawer>
    </div>
  );
};

export default LeadsPage;
