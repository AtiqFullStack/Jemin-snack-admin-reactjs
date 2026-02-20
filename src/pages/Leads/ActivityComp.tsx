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
  Timeline,
  Typography,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import activityLogservices from '../../services/activityService';

type Activity = {
  _id: string;
  content: string;
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

const ActivityComp = (props: any) => {
  const { id: leadId } = props;

  const [allActivity, setAllActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);

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
      const res: any = await creatactivityLogs({ leadId, content });

      if (res?.success) {
        message.success('Activity added');
        setNote('');
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
    return allActivity.map((a) => {
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
      <Flex
        style={{ marginTop: 12, borderRadius: 12 }}
        justify="space-between"
        align="center"
        gap={10}
      >
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={1}
          placeholder="Write a note... (e.g., Called customer, sent proposal, follow-up scheduled)"
          style={{ marginTop: 10, borderRadius: 10, width: '90%' }}
        />

        <Flex justify="flex-end" style={{ marginTop: 10 }}>
          <Button type="primary" onClick={onCreate} loading={creating}>
            Add
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ActivityComp;
