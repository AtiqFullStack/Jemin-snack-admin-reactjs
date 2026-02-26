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
} from 'antd';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/index';
import RelatedToList from '../../assets/jsons/related.json';
import leadServices from '../../services/leadServices';
import { apiRequest } from '../../services/api/apiClient';
import { API_ENDPOINTS } from '../../services/api/endpoints';
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
import { useNavigate } from 'react-router-dom';

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

const Tasks = ({ lead }: { lead?: any }) => {
  const { isLoading } = useAuth();
  const { createTask, getByLeadId, getTasksList, deleteTasks } = taskService();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterPriority, setFilterPriority] = useState<string | undefined>();
  const [staff, setStaffs] = useState([]);
  const [relatedType, setRelatedType] = useState<string>('Lead');
  const [leads, setLeads] = useState([]);
  const [searchLeadText, setSearchLeadText] = useState('');
  const navigate = useNavigate();

  const { getStaff } = staffService();
  const { getLeads } = leadServices();

  const fetchLeads = async () => {
    try {
      const response = (await getLeads()) as any;
      if (response.success) {
        setLeads(response.data.items || response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    fetchLeads();
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
    } else {
      getTasksList().then((res: any) => {
        if (res.success) {
          setTasks(res.data);
        }
      });
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
      title: 'Related To',
      dataIndex: 'relatedTo',
      key: 'relatedTo',
      width: 200,
      render: (relatedTo) => (
        <div>
          <Tag color="cyan" style={{ marginBottom: 4 }}>
            {relatedTo?.type || '-'}
          </Tag>
          {relatedTo?.id && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <div style={{ fontWeight: 500 }}>{relatedTo.id.name}</div>
              {relatedTo.id.email && <div>{relatedTo.id.email}</div>}
            </div>
          )}
        </div>
      ),
    },
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
      width: 180,
      filteredValue: filterStatus ? [filterStatus] : null,
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          size="small"
        >
          <Select.Option value="Pending">
            <Tag color={statusColors['Pending']}>Pending</Tag>
          </Select.Option>
          <Select.Option value="In Progress">
            <Tag color={statusColors['In Progress']}>In Progress</Tag>
          </Select.Option>
          <Select.Option value="Completed">
            <Tag color={statusColors['Completed']}>Completed</Tag>
          </Select.Option>
          <Select.Option value="Cancelled">
            <Tag color={statusColors['Cancelled']}>Cancelled</Tag>
          </Select.Option>
        </Select>
      ),
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
    navigate(`/crm/activities/tasks/${record._id}`);

    // Modal.info({
    //   title: record.subject,
    //   width: 600,
    //   content: (
    //     <div style={{ marginTop: 16 }}>
    //       <p>
    //         <strong>Assignee:</strong> {record.assignee?.firstName}{' '}
    //         {record.assignee?.lastName}
    //       </p>
    //       <p>
    //         <strong>Priority:</strong>{' '}
    //         <Tag color={priorityColors[record.priority]}>{record.priority}</Tag>
    //       </p>
    //       <p>
    //         <strong>Status:</strong>{' '}
    //         <Tag color={statusColors[record.status]}>{record.status}</Tag>
    //       </p>
    //       <p>
    //         <strong>Due Date:</strong>{' '}
    //         {new Date(record.dueDate).toLocaleDateString()}
    //       </p>
    //       {record.description && (
    //         <p>
    //           <strong>Description:</strong> {record.description}
    //         </p>
    //       )}
    //     </div>
    //   ),
    // });
  };

  const handleEdit = (record: Task) => {
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: any) => {
    Modal.confirm({
      title: 'Delete Task',
      content: 'Are you sure you want to delete this task?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        console.log(id);
        try {
          const res = (await deleteTasks(id)) as any;
          if (res.success) {
            message.success('Task deleted successfully');
            await fetchLeads();
          }
          // API call to delete
          // Refresh list
        } catch (error) {
          message.error('Failed to delete task');
        }
      },
    });
  };

  const handleLeadSearch = async (value: string) => {
    setSearchLeadText(value);
    if (value.length > 2 || value === '') {
      try {
        const endpoint = value
          ? `${API_ENDPOINTS.LEADS.LIST}?name=${value}`
          : API_ENDPOINTS.LEADS.LIST;
        const response = (await apiRequest.get(endpoint)) as any;
        console.log(response);
        if (response.success) {
          setLeads(response.data.items || response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCreateTask = () => {
    form.resetFields();
    if (lead) {
      setRelatedType('Lead');
      form.setFieldsValue({
        assignee: lead?.assignedTo?._id,
        relatedType: 'Lead',
        relatedId: lead._id,
        status: 'In Progress',
      });
    } else {
      form.setFieldsValue({
        relatedType: 'Lead',
        status: 'In Progress',
      });
    }
    setIsModalOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    console.log(taskId, newStatus);
    try {
      // const response = await apiRequest.patch(
      //   `${API_ENDPOINTS.TASKS.LIST}/${taskId}`,
      //   { status: newStatus }
      // ) as any;
      // if (response.success) {
      //   message.success('Status updated successfully');
      //   setTasks(tasks.map(task =>
      //     task._id === taskId ? { ...task, status: newStatus } : task
      //   ));
      // }
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      relatedTo: {
        type: values.relatedType,
        id: values.relatedId,
      },
    };
    delete payload.relatedType;
    delete payload.relatedId;

    try {
      const res = (await createTask(payload)) as any;
      console.log(res);
      if (res.success) {
        message.success('Task saved successfully');
        setIsModalOpen(false);
        // Refresh tasks
        if (lead) {
          getByLeadId(lead._id).then((res: any) => {
            if (res.success) setTasks(res.data);
          });
        } else {
          getTasksList().then((res: any) => {
            if (res.success) setTasks(res.data);
          });
        }
      }
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
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <Form.Item
              name="relatedType"
              label="Related Type"
              initialValue="Lead"
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select
                placeholder="Select Type"
                disabled={!!lead}
                onChange={(value) => {
                  setRelatedType(value);
                  form.setFieldsValue({ relatedId: undefined });
                }}
              >
                {RelatedToList.map((item) => (
                  <Select.Option key={item.value} value={item.label}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="relatedId"
              label={`Select ${relatedType}`}
              rules={[
                { required: true, message: `Please select ${relatedType}` },
              ]}
            >
              <Select
                placeholder={`Search and select ${relatedType}`}
                disabled={!!lead}
                showSearch
                onSearch={handleLeadSearch}
                filterOption={false}
                notFoundContent={
                  searchLeadText.length > 0 && searchLeadText.length < 3
                    ? 'Type at least 3 characters'
                    : 'No results found'
                }
              >
                {relatedType === 'Lead' &&
                  leads.map((item: any) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name} - {item.email}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

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
