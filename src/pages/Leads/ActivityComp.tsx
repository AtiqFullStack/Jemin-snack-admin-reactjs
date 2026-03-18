import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  message,
  Popconfirm,
  Space,
  Tag,
  Timeline,
  Typography,
  Upload,
} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PictureOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons';
import activityLogservices from '../../services/activityService';
import { getAttachmentUrl } from '../../utils/convertor';

type Activity = {
  _id: string;
  content: string;
  attachments?: Array<{
    url: string;
    name?: string;
    type?: string;
    size?: number;
  }>;
  callData?: {
    _id?: string;
    direction?: 'incoming' | 'outgoing' | string;
    status?: string;
    duration?: number;
  };
  taskId?: {
    subject?: string;
  };
  createdBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  leadId: string;
  createdAt: string;
};

const { Text, Paragraph } = Typography;

const formatCallDuration = (duration?: number) => {
  if (duration === undefined || duration === null) return '0s';
  if (duration < 60) return `${duration}s`;

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
};

const getCallStatusColor = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'completed':
      return 'success';
    case 'failed':
    case 'missed':
    case 'no-answer':
    case 'busy':
      return 'error';
    default:
      return 'default';
  }
};

const ActivityComp = (props: any) => {
  const { id: leadId } = props;

  const [allActivity, setAllActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { getByActivityId, creatactivityLogs, deleteactivityLogs } =
    activityLogservices();

  const load = async () => {
    try {
      setLoading(true);
      const res: any = await getByActivityId(leadId);
      if (res?.success) setAllActivity(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leadId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const onCreate = async () => {
    const content = note.trim();
    if (!content) return message.warning('Please write something');

    try {
      setCreating(true);
      const payload = new FormData();
      payload.append('leadId', leadId);
      payload.append('content', content);
      fileList.forEach((file) => {
        payload.append('leadAttachments', file.originFileObj);
      });
      const res: any = await creatactivityLogs(payload);

      if (res?.success) {
        message.success('Activity added');
        setNote('');
        setFileList([]);
        load();
      } else {
        message.error(res?.message || 'Failed to add activity');
      }
    } catch (e: any) {
      message.error(e?.message || 'Failed to add activity');
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (activityId: string) => {
    try {
      setDeletingId(activityId);

      const res: any = await deleteactivityLogs(activityId);

      if (res?.success) {
        message.success('Activity deleted');

        // optimistic remove
        setAllActivity((prev) => prev.filter((x) => x._id !== activityId));
      } else {
        message.error(res?.message || 'Failed to delete activity');
      }
    } catch (e: any) {
      message.error(e?.message || 'Failed to delete activity');
    } finally {
      setDeletingId(null);
    }
  };

  const timelineItems = useMemo(() => {
    return allActivity.map((a: Activity) => {
      const fullName =
        [a.createdBy?.firstName, a.createdBy?.lastName]
          .filter(Boolean)
          .join(' ')
          .trim() || '—';
      const when = a.createdAt ? new Date(a.createdAt).toLocaleString() : '';

      return {
        key: a._id,
        children: (
          <Card size="small" style={{ borderRadius: 12 }}>
            <Flex gap={12} align="flex-start">
              <Avatar src={a.createdBy?.avatar || undefined}>
                {fullName?.[0] || 'U'}
              </Avatar>

              <div style={{ flex: 1 }}>
                <Flex justify="space-between" align="flex-start" wrap>
                  <div>
                    <Space size={6}>
                      <Text strong>{fullName}</Text>
                      <Tag color={'green'}>{a?.taskId?.subject}</Tag>
                    </Space>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {when}
                      </Text>
                    </div>
                  </div>

                  <Popconfirm
                    title="Delete this activity?"
                    description="This action cannot be undone."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancel"
                    onConfirm={() => onDelete(a._id)}
                  >
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      loading={deletingId === a._id}
                    />
                  </Popconfirm>
                </Flex>

                <Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                  {a.content}
                </Paragraph>
                {a.callData && (
                  <Space
                    size={[8, 8]}
                    wrap
                    style={{ marginTop: 12, display: 'flex' }}
                  >
                    <Tag
                      icon={
                        a.callData.direction === 'outgoing' ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )
                      }
                      color={
                        a.callData.direction === 'outgoing' ? 'green' : 'blue'
                      }
                      style={{ textTransform: 'capitalize' }}
                    >
                      {a.callData.direction || 'incoming'}
                    </Tag>
                    <Tag icon={<ClockCircleOutlined />} color="default">
                      {formatCallDuration(a.callData.duration)}
                    </Tag>
                    <Tag
                      color={getCallStatusColor(a.callData.status)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {a.callData.status || 'unknown'}
                    </Tag>
                  </Space>
                )}
                {a.attachments && a.attachments.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {a.attachments.map((attachment: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #e8e8e8',
                        }}
                        onClick={() =>
                          window.open(
                            getAttachmentUrl(attachment.url),
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        <img
                          src={getAttachmentUrl(attachment.url)}
                          alt={attachment.name || 'attachment'}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Flex>
          </Card>
        ),
      };
    });
  }, [allActivity, deletingId]);

  return (
    <div>
      <Card
        title="Activity Log"
        loading={loading}
        style={{ borderRadius: 12 }}
        bodyStyle={{ padding: 14 }}
      >
        {allActivity?.length ? (
          <Timeline items={timelineItems} />
        ) : (
          <Empty description="No activity yet" />
        )}
      </Card>

      {/* Create new activity */}
      <Card
        style={{
          marginTop: 16,
          borderRadius: 16,
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        bodyStyle={{ padding: 20 }}
      >
        <div
          style={{
            background: '#fafafa',
            borderRadius: 12,
            padding: 16,
            border: '1px solid #e8e8e8',
          }}
        >
          <Input.TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Write a note... (e.g., Called customer, sent proposal, follow-up scheduled)"
            style={{
              borderRadius: 8,
              border: 'none',
              background: '#fff',
              fontSize: 14,
            }}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />

          {fileList.length > 0 && (
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                padding: 12,
                background: '#fff',
                borderRadius: 8,
              }}
            >
              {fileList.map((file, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '2px solid #e8e8e8',
                  }}
                >
                  <img
                    src={URL.createObjectURL(file.originFileObj)}
                    alt="preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Button
                    type="primary"
                    danger
                    size="small"
                    shape="circle"
                    icon={<CloseOutlined />}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                    onClick={() =>
                      setFileList(fileList.filter((_, i) => i !== index))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <Flex
            justify="space-between"
            align="center"
            style={{ marginTop: 16 }}
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
              showUploadList={false}
              accept="image/*"
            >
              <Button
                icon={<PictureOutlined />}
                size="large"
                style={{ borderRadius: 8 }}
              >
                Attach Images
              </Button>
            </Upload>

            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              onClick={onCreate}
              loading={creating}
              disabled={!note.trim()}
              style={{
                borderRadius: 8,
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              Post Activity
            </Button>
          </Flex>
        </div>
      </Card>
    </div>
  );
};

export default ActivityComp;
