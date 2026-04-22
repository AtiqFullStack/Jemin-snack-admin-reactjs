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
  Checkbox,
  Space,
  Modal,
  message,
  Upload,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { UserAvatar } from '../../components';
import leadServices from '../../services/leadServices';
import staffService from '../../services/staffService';
import { timeConverter } from '../../utils/convertor';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { fetchCountries } from '../../redux/countriesSlice';

import { LeadStage, LeadSource, LeadFormValues, Lead } from '../../types/leads';
import LeadViewModal from './LeadViewModal';
import { usePermissions } from '../../hooks/usePermissions';
import configService from '../../services/configService';

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
  const [searchParams] = useSearchParams();
  const { getConfig } = configService();

  const loc = useLocation().pathname;

  // const navigateWithLink = (id: any) => {
  //   window.location.href = `jeminisnacks://lead/${id}`;
  // };

  const { creatLeads, getLeads, deleteLeads, updateLeads, bulkCreateLeads } =
    leadServices();
  const { getStaff } = staffService();
  const dispatch = useDispatch<AppDispatch>();
  const countries = useSelector((state: any) => state.countries.countries);
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [LEADSTATUS, SETLEADSTATUS] = useState([]);
  const [LEADSOURCE, SETLEADSOURCE] = useState([]);
  const [PRIORITY, SETPRIORITY] = useState([]);
  const [importModal, setImportModal] = useState(false);
  const [importRows, setImportRows] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [activityPage, setActvityTab] = useState(false);

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

  useEffect(() => {
    if (loc.includes('activities/leads')) {
      setActvityTab(true);
    } else {
      setActvityTab(false);
    }
  }, [loc]);
  useEffect(() => {
    const leadId = searchParams.get('id');
    if (leadId && leads.length > 0) {
      const lead = leads.find((l) => l._id === leadId);
      if (lead) {
        setViewLead(lead);
      }
    }
  }, [searchParams, leads]);

  useEffect(() => {
    getConfig('leadStatus,leadPriority,leadSource')
      .then((res) => {
        if (res.success) {
          const leadStatus = res.data.find(
            (item: any) => item.key === 'leadStatus'
          );
          console.log(leadStatus);
          SETLEADSTATUS(leadStatus.value);
          const leadSource = res.data.find(
            (item: any) => item.key === 'leadSource'
          );
          SETLEADSOURCE(leadSource.value);

          const leadPriority = res.data.find(
            (item: any) => item.key === 'leadPriority'
          );

          SETPRIORITY(leadPriority.value);

          console.log(res);
          // SETLEADSTATUS(res.data.value)
        }
      })
      .catch((err) => console.log(err));

    // getConfig('leadSource').then((res) => {
    //   if (res.success) {
    //     SETLEADSOURCE(res.data.value)
    //   }
    // }).catch((err) => console.log(err))
  }, []);

  const fetchLeads = async () => {
    const res = (await getLeads()) as any;
    if (res.success) {
      setLeads(res.data);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const search = q.trim().toLowerCase();
      const matchesSearch =
        !search ||
        l?.name?.toLowerCase().includes(search) ||
        l?.company?.toLowerCase().includes(search) ||
        l?.email?.toLowerCase().includes(search) ||
        l?.phone?.toLowerCase().includes(search);

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
      priority: record.priority,
      zip: record.zip,
      language: 'English',
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
      priority: values.priority,
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
      zip: values.zip,
      language: 'English',
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

  const handleFileUpload = (file: File) => {
    setImportError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws);
        if (!rows.length)
          return setImportError('File is empty or invalid format');
        setImportRows(rows);
      } catch {
        setImportError('Failed to parse file. Use .xlsx or .csv format');
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleImportConfirm = async () => {
    setImportLoading(true);
    try {
      const leads = importRows.map((r) => ({
        name: r.name || r.Name || '',
        email: r.email || r.Email || '',
        phone: r.phone || r.Phone || '',
        company: r.company || r.Company || '',
        source: r.source || r.Source || 'Website',
        status: r.status || r.Status || r.leadStatus || r.LeadStatus || 'New',
        assignedTo: r.assignTo || r.AssignedTo,
        priority: r.priority || r.Priority || '',
        city: r.city || r.City || '',
        country: r.country || r.Country || '',
      }));

      const res = (await bulkCreateLeads(leads)) as any;
      if (res.success) {
        message.success(res.message);
        setImportModal(false);
        setImportRows([]);
        await fetchLeads();
      } else {
        setImportError(res.message || 'Import failed');
      }
    } catch {
      setImportError('Something went wrong');
    }
    setImportLoading(false);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        name: '',
        email: '',
        phone: '',
        company: '',
        source: '',
        status: '',
        priority: '',
        assignTo: '',
        city: '',
        country: '',
      },
    ]);

    if (ws.E1) {
      ws.E1.c = [
        {
          a: 'System',
          t: 'Allowed source values: Facebook, Referral, Website, Walk-in, Instagram',
        },
      ];
    }

    if (ws.F1) {
      ws.F1.c = [
        {
          a: 'System',
          t: 'leadStatus/status allowed values only: New, Contacted, Proposal',
        },
      ];
    }
    if (ws.G1) {
      ws.G1.c = [
        {
          a: 'System',
          t: 'priority allowed values only: low, medium, high',
        },
      ];
    }

    const instructionsWs = XLSX.utils.aoa_to_sheet([
      ['Field', 'Allowed values'],
      ['source', 'Facebook, Referral, Website, Walk-in, Instagram'],
      ['leadStatus / status', 'New, Contacted, Proposal'],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions');
    XLSX.writeFile(wb, 'leads_template.xlsx');
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
      render: (v: string[] | undefined) => (
        <Flex gap={2}>
          {(v ?? []).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
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
      render: (v: any, row: Lead) => (
        <Flex vertical gap={2}>
          <Typography.Text>{timeConverter(v)}</Typography.Text>
          <Tag color="blue">{row.createdBy?.name || '-'}</Tag>
        </Flex>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Lead) => (
        <Space>
          {/* <Button onClick={()=>navigateWithLink(record._id)}>
            App
          </Button> */}
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setViewLead(record)}
          />
          {!activityPage && (
            <>
              {canUpdate('leads') && (
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              )}
              {canDelete('leads') && (
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record)}
                />
              )}
            </>
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
        activeTab={activityPage}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Leads"
            extra={
              canCreate('leads') && (
                <>
                  {!activityPage && (
                    <Space>
                      <Button
                        icon={<UploadOutlined />}
                        onClick={() => {
                          setImportRows([]);
                          setImportError('');
                          setImportModal(true);
                        }}
                      >
                        Import Leads
                      </Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleOpenDrawer}
                      >
                        Add Lead
                      </Button>
                    </Space>
                  )}
                </>
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
                  options={LEADSTATUS}
                />
              </Col>

              <Col xs={24} md={7}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Filter by source"
                  allowClear
                  value={source}
                  onChange={(v) => setSource(v)}
                  options={LEADSOURCE}
                />
              </Col>
            </Row>

            <Table
              rowKey="_id"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 8 }}
              scroll={{ x: 'max-content' }}
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
                <Select placeholder="Nothing selected" options={LEADSTATUS} />
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
                <Select placeholder="Nothing selected" options={LEADSOURCE} />
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

          <Row gutter={[12, 12]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true }]}
              >
                <Select options={PRIORITY} />
              </Form.Item>
            </Col>
            {/* Tags */}

            <Col xs={24} md={12}>
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
            </Col>

            <Col xs={24} md={12}>
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

              {/* <Form.Item name="language" label="Default Language">
                <Select
                  options={[
                  { value: 'System Default', label: 'System Default' },
                  { value: 'English', label: 'English' },
                  ]}
                />
                
              </Form.Item> */}

              <Form.Item name="address" label="Address">
                <Input.TextArea rows={2} placeholder="" />
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

      <Modal
        title="Import Leads"
        open={importModal}
        onCancel={() => setImportModal(false)}
        onOk={handleImportConfirm}
        okText={`Import ${
          importRows.length ? `(${importRows.length} rows)` : ''
        }`}
        okButtonProps={{ disabled: !importRows.length, loading: importLoading }}
        width={700}
      >
        <Flex vertical gap={12}>
          <Flex justify="space-between" align="center">
            <Typography.Text type="secondary">
              Upload a .xlsx or .csv file with lead data
            </Typography.Text>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
            >
              Download Template
            </Button>
          </Flex>
          <Upload.Dragger
            accept=".xlsx,.csv"
            beforeUpload={handleFileUpload}
            showUploadList={false}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 32, color: '#1677ff' }} />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
            <p className="ant-upload-hint">.xlsx or .csv supported</p>
          </Upload.Dragger>
          {importError && <Alert type="error" message={importError} showIcon />}
          {importRows.length > 0 && (
            <>
              <Typography.Text strong>
                {importRows.length} rows detected. Preview (first 5):
              </Typography.Text>
              <Table
                size="small"
                dataSource={importRows.slice(0, 5)}
                columns={Object.keys(importRows[0]).map((k) => ({
                  title: k,
                  dataIndex: k,
                  key: k,
                  ellipsis: true,
                }))}
                pagination={false}
                rowKey={(_, i) => String(i)}
                scroll={{ x: 'max-content' }}
                rowHoverable={false}
              />
            </>
          )}
        </Flex>
      </Modal>
    </div>
  );
};

export default LeadsPage;
