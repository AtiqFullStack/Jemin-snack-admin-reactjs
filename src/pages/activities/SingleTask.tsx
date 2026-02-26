import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  Button,
  Divider,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import taskService from '../../services/taskService';

const { Title, Text, Paragraph } = Typography;

const SingleTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getById } = taskService();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = (await getById(taskId)) as any;
        if (res.success) {
          setTask(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, []);

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

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        Back
      </Button>

      <Card loading={loading} bordered={false}>
        {task && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <Space size="middle" style={{ marginBottom: '12px' }}>
                <Tag color={statusColors[task.status]}>{task.status}</Tag>
                <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
                {task.isPublic && <Tag color="green">Public</Tag>}
              </Space>
              <Title level={2} style={{ margin: 0 }}>
                {task.subject}
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card
                  title="Details"
                  size="small"
                  style={{ marginBottom: '16px' }}
                >
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text type="secondary">Description</Text>
                      <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                        {task.description || 'No description provided'}
                      </Paragraph>
                    </div>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">
                            <CalendarOutlined /> Start Date
                          </Text>
                          <Text>
                            {task.startDate
                              ? new Date(task.startDate).toLocaleDateString()
                              : 'Not set'}
                          </Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">
                            <ClockCircleOutlined /> Due Date
                          </Text>
                          <Text strong>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        </Space>
                      </Col>
                    </Row>

                    {task.tags?.length > 0 && (
                      <div>
                        <Text type="secondary">Tags</Text>
                        <div style={{ marginTop: '8px' }}>
                          <Space wrap>
                            {task.tags.map((tag: string, index: number) => (
                              <Tag key={index}>{tag}</Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                    )}
                  </Space>
                </Card>

                {task.repeat?.enabled && (
                  <Card title="Repeat Settings" size="small">
                    <Text>
                      Repeats {task.repeat.frequency} every {task.repeat.every}{' '}
                      time(s)
                    </Text>
                  </Card>
                )}
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  title="People"
                  size="small"
                  style={{ marginBottom: '16px' }}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text
                        type="secondary"
                        style={{ display: 'block', marginBottom: '8px' }}
                      >
                        Assignee
                      </Text>
                      <Space>
                        <Avatar icon={<UserOutlined />} />
                        <div>
                          <div>
                            <Text strong>
                              {task.assignee?.firstName}{' '}
                              {task.assignee?.lastName}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {task.assignee?.email}
                          </Text>
                        </div>
                      </Space>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    <div>
                      <Text
                        type="secondary"
                        style={{ display: 'block', marginBottom: '8px' }}
                      >
                        Created By
                      </Text>
                      <Space>
                        <Avatar icon={<UserOutlined />} size="small" />
                        <div>
                          <div>
                            <Text>
                              {task.createdBy?.firstName}{' '}
                              {task.createdBy?.lastName}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </Space>
                    </div>
                  </Space>
                </Card>

                <Card title="Related To" size="small">
                  <Space direction="vertical" size={4}>
                    <Tag color="cyan">{task.relatedTo?.type}</Tag>
                    <Text strong>{task.relatedTo?.id?.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {task.relatedTo?.id?.email}
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
};
export default SingleTask;
