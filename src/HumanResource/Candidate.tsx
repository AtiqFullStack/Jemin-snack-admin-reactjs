import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space } from 'antd';
import candidateService from 'src/services/candidateService';
import { Link } from 'react-router-dom';

const statusColors = {
  PENDING: 'default',
  OFFER_SENT: 'blue',
  ACCEPTED: 'green',
  DOC_COMPLETED: 'purple',
  JOINED: 'success',
};

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { getCandidates, createCandidates } = candidateService();

  useEffect(() => {
    const fetchData = async () => {
      const response = (await getCandidates()) as any;
      console.log(response);
      setCandidates(response.data);
    };
    fetchData();
  }, []);

  // Add Candidate
  const handleAdd = async (values) => {
    const newCandidate = {
      key: Date.now().toString(),
      ...values,
      status: 'PENDING',
    };
    const response = await createCandidates(newCandidate);
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
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary">
            Send Offer
          </Button>
          <Button disabled={!_._id} size="small">
            <Link to={`/hrms/candidate/${record?._id}`}>View</Link>
          </Button>
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
            rules={[{ required: true, message: 'Enter designation' }]}
          >
            <Input />
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
