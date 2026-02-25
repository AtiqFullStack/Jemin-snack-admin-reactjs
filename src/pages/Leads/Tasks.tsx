import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Dropdown,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Switch,
  InputNumber,
  Upload,
  Badge,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/index';
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import staffService from '../../services/staffService';
import taskService from '../../services/taskService';
import { set } from 'lodash';

interface Task {
  _id: string;
  subject: string;
  assignee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  relatedTo: {
    type: string;
    id: string;
  };
  dueDate: string;
  priority: string;
  status: string;
  description?: string;
  createdAt: string;
}

const Tasks = ({ lead }: any) => {
  const { isLoading } = useAuth();
  const { createTask, getByLeadId } = taskService();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterPriority, setFilterPriority] = useState<string | undefined>();
  const [staff, setStaffs] = useState([]);
  console.log(lead);

  const { getStaff } = staffService();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = (await getStaff()) as any;
        setStaffs(response.data.items);
        const data = response.data.items;
        if (data.length) {
          setStaffs(
            data.map((item: any) => ({
              value: item._id,
              label: `${item.firstName} ${item.lastName}`,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStaff();
  }, []);
  useEffect(() => {
    if (lead) {
      getByLeadId(lead._id)
        .then((res: any) => {
          if (res.success) {
            setTasks(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [lead]);
  console.log(staff);

  const priorityColors: Record<string, string> = {
    Low: 'blue',
    Medium: 'orange',
    High: 'red',
    Urgent: 'purple',
  };

  const statusColors: Record<string, string> = {
    Pending: 'default',
    'In Progress': 'processing',
    Completed: 'success',
    Cancelled: 'error',
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 250,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.subject.toLowerCase().includes(value.toString().toLowerCase()),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 180,
      render: (assignee) =>
        assignee ? (
          <Tag color="blue" style={{ padding: '4px 10px' }}>
            {assignee.firstName} {assignee.lastName}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      filteredValue: filterPriority ? [filterPriority] : null,
      onFilter: (value, record) => record.priority === value,
      render: (priority) => (
        <Tag color={priorityColors[priority]}>{priority}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      filteredValue: filterStatus ? [filterStatus] : null,
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 140,
      render: (date) => new Date(date).toLocaleDateString(),
    },

    {
      title: 'Action',
      key: 'action',
      width: 100,
      // fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'View',
                onClick: () => handleView(record),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
                onClick: () => handleEdit(record),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                danger: true,
                onClick: () => handleDelete(record._id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleView = (record: Task) => {
    Modal.info({
      title: record.subject,
      width: 600,
      content: (
        <div style={{ marginTop: 16 }}>
          <p>
            <strong>Assignee:</strong> {record.assignee?.firstName}{' '}
            {record.assignee?.lastName}
          </p>
          <p>
            <strong>Priority:</strong>{' '}
            <Tag color={priorityColors[record.priority]}>{record.priority}</Tag>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <Tag color={statusColors[record.status]}>{record.status}</Tag>
          </p>
          <p>
            <strong>Due Date:</strong>{' '}
            {new Date(record.dueDate).toLocaleDateString()}
          </p>
          {record.description && (
            <p>
              <strong>Description:</strong> {record.description}
            </p>
          )}
        </div>
      ),
    });
  };

  const handleEdit = (record: Task) => {
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Task',
      content: 'Are you sure you want to delete this task?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          // API call to delete
          message.success('Task deleted successfully');
          // Refresh list
        } catch (error) {
          message.error('Failed to delete task');
        }
      },
    });
  };

  const handleCreateTask = () => {
    form.resetFields();
    form.setFieldsValue({
      assignee: lead?.assignedTo?._id,
      relatedTo: {
        type: 'Lead',
        id: lead._id,
      },
    });

    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    console.log(values);
    const payload = {
      ...values,
      relatedTo: {
        type: 'Lead',
        id: lead._id,
      },
    };
    try {
      const res = (await createTask(payload)) as any;
      if (res.success) {
        message.success('Task saved successfully');
        setIsModalOpen(false);
      }
      // API call to create/update
      // setIsModalOpen(false)
      // form.resetFields()
      // Refresh list
    } catch (error) {
      message.error('Failed to save task');
    }
  };

  return (
    <div>
      <Card
        title="Tasks"
        loading={isLoading}
        style={{ borderRadius: 12 }}
        bodyStyle={{ padding: 14 }}
        extra={
          <Space>
            <Input
              placeholder="Search tasks..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="Priority"
              style={{ width: 120 }}
              onChange={setFilterPriority}
              allowClear
            >
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Urgent">Urgent</Select.Option>
            </Select>
            <Select
              placeholder="Status"
              style={{ width: 140 }}
              onChange={setFilterStatus}
              allowClear
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTask}
            >
              Create Task
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tasks`,
          }}
          rowHoverable={false}
        />
      </Card>

      <Modal
        title="Create Task"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width="90%"
        style={{ top: 20, maxWidth: 1200 }}
        styles={{
          body: {
            maxHeight: '75vh',
            overflowY: 'auto',
            padding: '24px',
          },
        }}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please enter subject' }]}
            >
              <Input placeholder="Enter task subject" size="large" />
            </Form.Item>

            <Form.Item
              name="assignee"
              label="Assignee"
              rules={[{ required: true, message: 'Please select assignee' }]}
            >
              <Select
                placeholder="Select assignee"
                size="large"
                onChange={(value) => {
                  console.log(`selected ${value}`);
                }}
                options={staff}
              >
                {/* Add staff options here */}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority">
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
                <Select.Option value="Urgent">Urgent</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Cancelled">Cancelled</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date' }]}
            >
              <DatePicker style={{ width: '100%' }} showTime />
            </Form.Item>

            <Form.Item name="startDate" label="Start Date">
              <DatePicker style={{ width: '100%' }} showTime />
            </Form.Item>
          </div>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags (press enter to add)" />
          </Form.Item>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginBottom: 16,
            }}
          >
            <Form.Item
              name="isPublic"
              label="Public Task"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch />
            </Form.Item>

            {/* <Form.Item
                            name="isBillable"
                            label="Billable"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="hourlyRate"
                            label="Hourly Rate ($)"
                            style={{ marginBottom: 0 }}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="Rate" />
                        </Form.Item> */}
          </div>

          <Form.Item name="attachments" label="Attachments">
            <Upload beforeUpload={() => false} multiple listType="text">
              <Button icon={<UploadOutlined />}>Upload Files</Button>
            </Upload>
          </Form.Item>

          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              padding: '16px',
              background: '#fafafa',
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <Form.Item
                name={['repeat', 'enabled']}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Space>
                  <Switch />
                  <span style={{ fontWeight: 500 }}>Enable Repeat Task</span>
                </Space>
              </Form.Item>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              <Form.Item
                name={['repeat', 'frequency']}
                label="Frequency"
                style={{ marginBottom: 0 }}
              >
                <Select placeholder="Select">
                  <Select.Option value="Daily">Daily</Select.Option>
                  <Select.Option value="Weekly">Weekly</Select.Option>
                  <Select.Option value="Monthly">Monthly</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name={['repeat', 'every']}
                label="Every"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  min={1}
                  placeholder="1"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
