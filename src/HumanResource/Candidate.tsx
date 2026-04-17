import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  Select,
  Checkbox,
  message,
  PopconfirmProps,
  Popconfirm,
} from 'antd';
import candidateService from 'src/services/candidateService';
import { Link } from 'react-router-dom';
import configService from 'src/services/configService';
import { Trash } from 'lucide-react';

const statusColors = {
  PENDING: 'default',
  OFFER_SENT: 'blue',
  ACCEPTED: 'green',
  DOC_COMPLETED: 'purple',
  JOINED: 'success',
};

const Candidate = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [designations, setDesignations] = useState<any>([]);
  const [form] = Form.useForm();
  const { getCandidates, createCandidates, deleteCandidate } =
    candidateService();
  const { getConfig } = configService();

  const [messageApi] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    console.log(e);
    const res = (await deleteCandidate(selectedUser._id)) as any;
    console.log(res);
    if (res.success) {
      messageApi.success(res.message);
      fetchData();
    }
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    // messageApi.error('Click on No');
    // fetchData()
  };

  const fetchData = async () => {
    const response = (await getCandidates()) as any;
    console.log(response);
    setCandidates(response.data);
  };
  useEffect(() => {
    getConfig('employeDesignation')
      .then((res: any) => {
        setDesignations(res.data.value || []);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchData();
  }, []);

  console.log(designations);
  // Add Candidate
  const handleAdd = async (values: any) => {
    const newCandidate = {
      key: Date.now().toString(),
      ...values,
      status: 'PENDING',
    };
    console.log(newCandidate);
    // return
    const response = (await createCandidates(newCandidate)) as any;
    if (response) {
      setCandidates([...candidates, response.data]);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Space>
          <Button disabled={!_._id} size="small" type="primary">
            <Link to={`/hrms/candidate/${record?._id}`}>View</Link>
          </Button>
          <Popconfirm
            title="Delete the task"
            description={`Are you sure to delete this Candidate . ${selectedUser?.name}?`}
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              onClick={() => setSelectedUser(_)}
              disabled={!_._id}
              size="small"
              type="primary"
            >
              <Trash size={15} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Candidate Management</h2>

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        + Add Candidate
      </Button>

      <Table rowHoverable={false} columns={columns} dataSource={candidates} />

      {/* Modal */}
      <Modal
        title="Add Candidate"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Enter name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Enter email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[{ required: true, message: 'Enter mobile' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true, message: 'Select designation' }]}
          >
            <Select
              placeholder="Select designation"
              options={designations.map((d: any) => ({
                label: d.label,
                value: d.label,
              }))}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="isBDE" label="Is BDE">
            <Checkbox
              onChange={(e) =>
                form.setFields([{ name: 'isBDE', value: e.target.checked }])
              }
              checked={form.getFieldValue('isBDE')}
            >
              Is BDE
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="source"
            label="Source"
            rules={[{ required: false, message: 'Enter source' }]}
          >
            <Input placeholder="e.g. LinkedIn, Referral" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Candidate
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Candidate;
