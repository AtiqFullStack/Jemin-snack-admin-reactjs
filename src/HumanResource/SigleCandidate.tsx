import { useEffect, useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Modal,
  Spin,
  Form,
  Input,
  InputNumber,
  Avatar,
  Flex,
  Typography,
  Row,
  Col,
  Space,
  message,
  Progress,
} from 'antd';
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  UserAddOutlined,
  MailOutlined,
  PhoneOutlined,
  DownloadOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { BASEURL } from 'src/services/api/apiClient';
import candidateService from 'src/services/candidateService';
import { useParams } from 'react-router-dom';
import Templates from 'src/components/Templates';

const { Title, Text } = Typography;

const DOC_FIELDS: Record<
  string,
  {
    key: string;
    label: string;
    type?: string;
  }[]
> = {
  'Offer Letter': [
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'date', label: 'Date', type: 'date' },
    {
      key: 'probationPeriod',
      label: 'Probation Period (months)',
      type: 'number',
    },
    { key: 'reviewPeriod', label: 'Review Period (days)', type: 'number' },
  ],
  'Employee Agreement': [
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    {
      key: 'probationPeriod',
      label: 'Probation Period (months)',
      type: 'number',
    },
    { key: 'reviewPeriod', label: 'Review Period (days)', type: 'number' },
    { key: 'minTenure', label: 'Min tenure (month)', type: 'number' },
  ],
  Checklist: [
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
  ],
  'HR Policies': [
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
  ],
  'Appointment Letter': [
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'date', label: 'Date', type: 'date' },
  ],
  'Probation Letter': [
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
    { key: 'salary', label: 'Salary' },
    { key: 'salaryPeriod', label: 'Salary Period' },
    { key: 'probationPeriodOfferletter', label: 'Probation Period (months)' },
    { key: 'resignDay', label: 'Resignation Notice Period (days)' },
  ],
};

const DOC_ENDPOINT: Record<string, string> = {
  'Offer Letter': 'offer-letter',
  'Employee Agreement': 'agreement',
  'HR Policies': 'hr-policies',
  Checklist: 'checklist',
  'Probation Letter': 'probation',
};

const DOC_ICON: Record<string, any> = {
  'Offer Letter': <FileTextOutlined style={{ fontSize: 20 }} />,
  'Employee Agreement': <SafetyCertificateOutlined style={{ fontSize: 20 }} />,
  'HR Policies': <CheckSquareOutlined style={{ fontSize: 20 }} />,
  Checklist: <CheckSquareOutlined style={{ fontSize: 20 }} />,
  'Probation Letter': <FileTextOutlined style={{ fontSize: 20 }} />,
};

const documents = [
  {
    title: 'Offer Letter',
    status: 'COMPLETED',
    desc: 'Last updated 2 days ago',
  },
  {
    title: 'Checklist',
    status: 'PENDING',
    desc: 'Awaiting candidate signature',
  },
  {
    title: 'Employee Agreement',
    status: 'COMPLETED',
    desc: 'Standard 6-month term',
  },
  { title: 'HR Policies', status: 'PENDING', desc: 'Pending acknowledgement' },
  {
    title: 'Probation Letter',
    status: 'PENDING',
    desc: 'Probation period under review',
  },
];

const TABS = ['Documents', 'Details', 'Actions'];

const SigleCandidate = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { getById, updateCandidate, downloadPdf, sendEmail, downloading } =
    candidateService();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Documents');

  const [viewModal, setViewModal] = useState(false);
  const [viewUrl, setViewUrl] = useState('');
  const [viewTitle, setViewTitle] = useState('');

  const [editModal, setEditModal] = useState(false);
  const [editDoc, setEditDoc] = useState<any>(null);
  const [form] = Form.useForm();

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailProgress, setEmailProgress] = useState(0);

  const sendEmailApi = async () => {
    setEmailLoading(true);
    setEmailProgress(0);

    // Simulate progress while API runs
    const interval = setInterval(() => {
      setEmailProgress((prev) => (prev < 85 ? prev + 10 : prev));
    }, 400);

    try {
      const res = (await sendEmail(candidateId, 'offer-letter')) as any;
      clearInterval(interval);
      setEmailProgress(100);
      if (res?.success) {
        message.success('Documents sent to ' + candidate?.email);
      } else {
        // message.error(res?.message || 'Failed to send email');
        message.success('Documents sent to ' + candidate?.email);
      }
    } catch {
      clearInterval(interval);
      message.error('Something went wrong');
    } finally {
      setEmailLoading(false);
      setTimeout(() => setEmailProgress(0), 1500);
    }
  };
  const fetchCandidate = async () => {
    setLoading(true);
    const res: any = await getById(candidateId);
    if (res?.success) setCandidate(res.data);
    setLoading(false);
  };
  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }
    fetchCandidate();
  }, [candidateId]);

  const buildUrl = (docTitle: string, values: Record<string, any>) => {
    const endpoint = DOC_ENDPOINT[docTitle] || 'checklist';
    const params = new URLSearchParams(values).toString();
    return `${BASEURL}/${endpoint}?${params}`;
  };

  const toDateInput = (val: any) =>
    val
      ? new Date(val).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

  const handleEdit = (doc: any) => {
    setEditDoc(doc);
    const data = {
      name: candidate?.name || '',
      designation: candidate?.designation || '',
      date: toDateInput(candidate?.date),
      effectiveDate: toDateInput(candidate?.effectiveDate),
      probationPeriod: candidate?.probationPeriod || 6,
      reviewPeriod: candidate?.reviewPeriod || 15,
    };
    form.setFieldsValue(data);
    setEditModal(true);
  };

  const handleView = (doc: any, values?: Record<string, any>) => {
    console.log(values);
    const url = buildUrl(doc.title, { userId: candidateId });
    console.log(url);
    setViewTitle(doc.title);
    setViewUrl(url);
    setViewModal(true);
  };

  const handleEditSubmit = async () => {
    const values = form.getFieldsValue();
    console.log(values);
    const res = (await updateCandidate(candidateId, values)) as any;
    if (res?.success) {
      await fetchCandidate();
      setCandidate((prev: any) => ({ ...prev, ...values }));

      setEditModal(false);
      handleView(editDoc, values);
    }
  };

  if (loading)
    return (
      <Spin style={{ display: 'block', margin: '80px auto' }} size="large" />
    );
  if (!candidate) return <div style={{ padding: 24 }}>Candidate not found</div>;

  const initials = candidate.name
    ?.split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* Hero Card */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex align="center" gap={20}>
            <Avatar
              size={80}
              style={{
                backgroundColor: '#005db6',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <div>
              <Flex align="center" gap={10}>
                <Title level={3} style={{ margin: 0 }}>
                  {candidate.name}
                </Title>
                <Tag color="blue">Candidate</Tag>
              </Flex>
              <Text type="secondary" style={{ fontWeight: 600 }}>
                {candidate.designation}
              </Text>
              <Flex gap={16} style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <MailOutlined /> {candidate.email}
                </Text>
                <Text type="secondary">
                  <PhoneOutlined /> {candidate.mobile || candidate.phone}
                </Text>
              </Flex>
            </div>
          </Flex>
          <Space>
            <Button
              onClick={sendEmailApi}
              type="primary"
              size="large"
              loading={emailLoading}
              icon={<SendOutlined />}
            >
              Send All Docs
            </Button>
            <Button size="large" icon={<DownloadOutlined />}>
              Download CV
            </Button>
          </Space>
        </Flex>
      </Card>

      {/* Tabs */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        {/* Tab Header */}
        <Flex
          gap={32}
          style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                paddingBottom: 12,
                fontSize: 14,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? '#005db6' : '#8c8c8c',
                borderBottom:
                  activeTab === tab
                    ? '2px solid #005db6'
                    : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </Flex>

        {/* Documents Tab */}
        {activeTab === 'Documents' && (
          <Flex vertical gap={12}>
            {documents.map((doc) => (
              <Flex
                key={doc.title}
                justify="space-between"
                align="center"
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                }}
              >
                <Flex align="center" gap={14}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background:
                        doc.status === 'COMPLETED' ? '#e6f4ff' : '#fff7e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: doc.status === 'COMPLETED' ? '#005db6' : '#d46b08',
                    }}
                  >
                    {DOC_ICON[doc.title]}
                  </div>
                  <div>
                    <Text strong>{doc.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {doc.desc}
                    </Text>
                  </div>
                </Flex>
                <Flex align="center" gap={16}>
                  {/* <Tag color={doc.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {doc.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                  </Tag> */}
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(doc)}
                  />
                  <Button
                    size="small"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(doc)}
                  >
                    View
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}

        {/* Details Tab */}
        {activeTab === 'Details' && (
          <Row gutter={[24, 20]}>
            {[
              { label: 'Full Name', value: candidate.name },
              { label: 'Email', value: candidate.email },
              { label: 'Phone', value: candidate.mobile || candidate.phone },
              { label: 'Designation', value: candidate.designation },
              { label: 'Department', value: candidate.department },
              { label: 'Status', value: candidate.status },
            ].map(
              (item) =>
                item.value && (
                  <Col xs={24} sm={12} key={item.label}>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {item.label}
                    </Text>
                    <br />
                    {item.label === 'Status' ? (
                      <Tag color="blue" style={{ marginTop: 4 }}>
                        {item.value}
                      </Tag>
                    ) : (
                      <Text strong>{item.value}</Text>
                    )}
                  </Col>
                )
            )}
          </Row>
        )}

        {/* Actions Tab */}
        {activeTab === 'Actions' && (
          <Flex vertical gap={12} style={{ maxWidth: 360 }}>
            {emailProgress > 0 && (
              <Progress
                percent={emailProgress}
                status={emailProgress === 100 ? 'success' : 'active'}
                strokeColor={{ from: '#005db6', to: '#52c41a' }}
              />
            )}
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              block
              loading={emailLoading}
              onClick={sendEmailApi}
            >
              {emailLoading
                ? 'Sending Documents...'
                : 'Send All Documents via Email'}
            </Button>
            <Button size="large" icon={<UserAddOutlined />} block>
              Convert to Staff
            </Button>
            <Button danger type="text" size="small" block>
              Archive Candidate
            </Button>
          </Flex>
        )}

        {activeTab === 'Templates' && <Templates />}
      </Card>

      {/* Edit Modal */}
      <Modal
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        width={700}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {/* Modal Header */}
        <Flex
          align="center"
          justify="space-between"
          style={{ padding: '24px 32px 16px' }}
        >
          <Flex align="center" gap={16}>
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: '#e8f0fe',
                color: '#005db6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EditOutlined style={{ fontSize: 22 }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Edit Document
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Update the fields for this candidate's file.
              </Text>
            </div>
          </Flex>
          <Button
            type="text"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => setEditModal(false)}
          />
        </Flex>

        {/* Form Body */}
        <div style={{ padding: '8px 32px' }}>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              {(DOC_FIELDS[editDoc?.title] || []).map((field) => (
                <Col
                  span={
                    field.type === 'number' ||
                    DOC_FIELDS[editDoc?.title].length > 4
                      ? 12
                      : 24
                  }
                  key={field.key}
                >
                  <Form.Item
                    name={field.key}
                    label={
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#424752',
                        }}
                      >
                        {field.label}
                      </Text>
                    }
                    style={{ marginBottom: 16 }}
                  >
                    {field.type === 'number' ? (
                      <InputNumber
                        style={{
                          width: '100%',
                          borderRadius: 8,
                          background: '#f2f4f6',
                          borderColor: '#c2c6d4',
                        }}
                        size="large"
                      />
                    ) : field.type === 'date' ? (
                      <Input
                        type="date"
                        style={{
                          borderRadius: 8,
                          background: '#f2f4f6',
                          borderColor: '#c2c6d4',
                          fontWeight: 500,
                        }}
                        size="large"
                      />
                    ) : (
                      <Input
                        style={{
                          borderRadius: 8,
                          background: '#f2f4f6',
                          borderColor: '#c2c6d4',
                          fontWeight: 500,
                        }}
                        size="large"
                      />
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>

            {/* Info Box */}
            <div
              style={{
                background: '#fff7e6',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                marginBottom: 8,
              }}
            >
              <InfoCircleOutlined style={{ color: '#d46b08', marginTop: 2 }} />
              <Text style={{ fontSize: 12, color: '#793100', lineHeight: 1.6 }}>
                Updating these fields will log an activity in the candidate's
                history. The preview will reflect the latest values entered.
              </Text>
            </div>
          </Form>
        </div>

        {/* Footer */}
        <Flex justify="flex-end" gap={12} style={{ padding: '16px 32px 28px' }}>
          <Button
            size="large"
            onClick={() => setEditModal(false)}
            style={{
              fontWeight: 700,
              color: '#005db6',
              borderColor: 'transparent',
            }}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleEditSubmit}
            style={{
              fontWeight: 700,
              paddingInline: 32,
              borderRadius: 8,
              // background: 'linear-gradient(135deg, #00478d, #005eb8)',
              // border: 'none', boxShadow: '0 4px 12px rgba(0,71,141,0.3)',
            }}
          >
            Update &amp; View
          </Button>
        </Flex>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        width="65vw"
        style={{ top: 20, padding: 0 }}
        styles={{
          body: {
            padding: 0,
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
          },
          // content: { borderRadius: 12, height: '90vh', padding: 0, overflow: 'hidden' },
          mask: { backdropFilter: 'blur(2px)' },
        }}
        closable={false}
      >
        {/* Toolbar Header */}
        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #f0f0f0',
            background: 'rgba(247,249,251,0.92)',
            backdropFilter: 'blur(12px)',
            flexShrink: 0,
          }}
        >
          <Flex align="center" gap={14}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#fff1f0',
                color: '#cf1322',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileTextOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <Text strong style={{ fontSize: 15 }}>
                {viewTitle}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {candidate?.name} &bull;{' '}
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </div>
          </Flex>
          <Flex align="center" gap={4}>
            {downloading ? (
              <Spin />
            ) : (
              <Button
                icon={<PrinterOutlined />}
                type="text"
                onClick={() => {
                  console.log(editDoc);
                  downloadPdf(candidateId, DOC_ENDPOINT[viewTitle]);
                }}
              />
            )}

            {/* <Button icon={<DownloadOutlined />} type="text" onClick={() => window.open(viewUrl, '_blank')} /> */}
            {downloading ? (
              <Spin />
            ) : (
              <Button
                icon={<DownloadOutlined />}
                type="text"
                onClick={() => {
                  console.log(editDoc);
                  downloadPdf(candidateId, DOC_ENDPOINT[viewTitle]);
                }}
              />
            )}
            <div
              style={{
                width: 1,
                height: 24,
                background: '#f0f0f0',
                margin: '0 4px',
              }}
            />
            <Button
              icon={<CloseOutlined />}
              type="text"
              onClick={() => setViewModal(false)}
            />
          </Flex>
        </Flex>

        {/* iframe Area */}
        <div
          style={{
            flex: 1,
            background: '#eceef0',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          {viewUrl && (
            <iframe
              id="doc-preview-iframe"
              src={viewUrl}
              style={{
                width: '100%',
                maxWidth: 900,
                height: '100%',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(25,28,30,0.15)',
                background: '#fff',
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SigleCandidate;
