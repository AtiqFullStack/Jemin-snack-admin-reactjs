import { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Card,
  Space,
  Typography,
  Flex,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { UserAvatar } from 'src/components';
import leaveService from 'src/services/leaveService';
import { timeConverter } from 'src/utils/convertor';
// import { UserAvatar } from '../../components';
// import leaveService from '../../services/leaveService';
// import { timeConverter } from '../../utils/convertor';

timeConverter;

const { Text } = Typography;

const LEAVE_TYPE_LABELS: Record<string, string> = {
  CL: 'Casual Leave',
  SL: 'Sick Leave',
  PL: 'Paid Leave',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
};

const Leave = () => {
  const { getAllLeaves, updateLeaveStatus } = leaveService();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLeaves = async () => {
    setLoading(true);
    const res: any = await getAllLeaves();
    if (res?.success) setLeaves(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    setActionLoading(id + status);
    const res: any = await updateLeaveStatus(id, status);
    if (res?.success) {
      message.success(`Leave ${status.toLowerCase()} successfully`);
      setLeaves((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      );
    } else {
      message.error(res?.message || 'Failed to update status');
    }
    setActionLoading(null);
  };

  const filtered = leaves.filter((l) => {
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchType = !typeFilter || l.type === typeFilter;
    return matchStatus && matchType;
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === 'PENDING').length,
    approved: leaves.filter((l) => l.status === 'APPROVED').length,
    rejected: leaves.filter((l) => l.status === 'REJECTED').length,
  };

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, row: any) => (
        <Flex align="center" gap={8}>
          <UserAvatar fullName={row.employeeId?.name} />
          <Flex vertical gap={2}>
            <Text strong>{row.employeeId?.name || '-'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {row.employeeId?.email}
            </Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (v: string) => (
        <Tag color="blue">{LEAVE_TYPE_LABELS[v] || v}</Tag>
      ),
    },
    {
      title: 'From',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (v: string) => timeConverter(v),
    },
    {
      title: 'To',
      dataIndex: 'toDate',
      key: 'toDate',
      render: (v: string) => timeConverter(v),
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
      render: (v: number) => (
        <Tag>
          {v} day{v > 1 ? 's' : ''}
        </Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag color={STATUS_COLOR[v] || 'default'}>{v}</Tag>
      ),
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => timeConverter(v),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, row: any) => {
        if (row.status !== 'PENDING') return <Text type="secondary">—</Text>;
        return (
          <Space>
            <Popconfirm
              title="Approve this leave?"
              onConfirm={() => handleStatus(row._id, 'APPROVED')}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                loading={actionLoading === row._id + 'APPROVED'}
              >
                Approve
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Reject this leave?"
              onConfirm={() => handleStatus(row._id, 'REJECTED')}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                loading={actionLoading === row._id + 'REJECTED'}
              >
                Reject
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Flex vertical gap={16} style={{ padding: 24 }}>
      {/* Stats Row */}
      <Flex gap={12} wrap="wrap">
        {[
          { label: 'Total', value: stats.total, color: '#1677ff' },
          { label: 'Pending', value: stats.pending, color: '#fa8c16' },
          { label: 'Approved', value: stats.approved, color: '#52c41a' },
          { label: 'Rejected', value: stats.rejected, color: '#ff4d4f' },
        ].map((s) => (
          <Card
            key={s.label}
            size="small"
            style={{ minWidth: 120, borderTop: `3px solid ${s.color}` }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              {s.label}
            </Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </Card>
        ))}
      </Flex>

      <Card
        title="Leave Requests"
        extra={
          <Space>
            <Select
              placeholder="Filter by type"
              allowClear
              style={{ width: 150 }}
              value={typeFilter}
              onChange={setTypeFilter}
              options={Object.entries(LEAVE_TYPE_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
            />
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 140 }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={['PENDING', 'APPROVED', 'REJECTED'].map((s) => ({
                value: s,
                label: s,
              }))}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchLeaves}
              loading={loading}
            />
          </Space>
        }
      >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          rowHoverable={false}
          rowClassName={(row) =>
            row.status === 'PENDING' ? 'pending-row' : ''
          }
        />
      </Card>
    </Flex>
  );
};

export default Leave;
