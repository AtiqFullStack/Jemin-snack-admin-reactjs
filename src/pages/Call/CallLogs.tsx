import { useEffect, useRef, useState } from 'react';
import {
  Table,
  Tag,
  Card,
  Statistic,
  Row,
  Col,
  Button,
  Slider,
  Tooltip,
} from 'antd';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Play,
  Pause,
  Download,
  Users,
  TrendingUp,
} from 'lucide-react';
import useCallService from '../../services/useCallService';
import { BASEURL } from '../../services/api/apiClient';

type Lead = { _id: string; name: string; email: string; phone: string };
type User = { _id: string; firstName: string; lastName: string; email: string };
type Call = {
  _id: string;
  leadId: Lead;
  userId: User;
  from: string;
  to: string;
  direction: 'incoming' | 'outgoing';
  status: string;
  startedAt: string;
  duration: number;
  recordingUrl?: string;
};

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, '0')}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const statusColor: Record<string, string> = {
  completed: 'success',
  failed: 'error',
  'in-progress': 'warning',
  busy: 'error',
  'no-answer': 'default',
};

function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 240 }}
    >
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
      />
      <Button
        type="primary"
        shape="circle"
        size="small"
        icon={playing ? <Pause size={12} /> : <Play size={12} />}
        onClick={toggle}
      />
      <Slider
        min={0}
        max={duration || 1}
        value={currentTime}
        step={0.1}
        onChange={(v) => {
          if (audioRef.current) audioRef.current.currentTime = v;
          setCurrentTime(v);
        }}
        style={{ flex: 1, margin: '0 4px' }}
        tooltip={{ formatter: (v) => fmt(v || 0) }}
      />
      <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
        {fmt(currentTime)} / {fmt(duration)}
      </span>
      <Tooltip title="Download">
        <Button
          size="small"
          shape="circle"
          icon={<Download size={12} />}
          href={url}
          download
          target="_blank"
        />
      </Tooltip>
    </div>
  );
}

const CallLogs = () => {
  const { getCallHistoryApi } = useCallService();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCallHistoryApi()
      .then((res: any) => {
        if (res?.data?.success) setCalls(res.data.data.calls);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalDuration = calls.reduce((a, c) => a + c.duration, 0);
  const completed = calls.filter((c) => c.status === 'completed').length;

  const columns = [
    {
      title: 'Lead',
      key: 'lead',
      render: (_: any, r: Call) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.leadId?.name || '—'}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{r.to}</div>
        </div>
      ),
    },
    {
      title: 'Agent',
      key: 'agent',
      render: (_: any, r: Call) => (
        <div>
          <div>
            {r.userId?.firstName} {r.userId?.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{r.from}</div>
        </div>
      ),
    },
    {
      title: 'Direction',
      key: 'direction',
      render: (_: any, r: Call) => (
        <Tag
          color={r.direction === 'outgoing' ? 'blue' : 'green'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            width: 'fit-content',
          }}
        >
          {r.direction === 'outgoing' ? (
            <PhoneOutgoing size={12} />
          ) : (
            <PhoneIncoming size={12} />
          )}
          {r.direction}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, r: Call) => (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#555',
          }}
        >
          <Clock size={13} /> {fmt(r.duration)}
        </span>
      ),
    },
    {
      title: 'Date',
      key: 'date',
      render: (_: any, r: Call) => (
        <span style={{ fontSize: 13, width: '10%' }}>
          {fmtDate(r.startedAt)}
        </span>
      ),
    },
    {
      title: 'Recording',
      key: 'recording',
      render: (_: any, r: Call) =>
        r.recordingUrl ? (
          <AudioPlayer
            url={`${BASEURL}/api/call/recording?url=${encodeURIComponent(
              r.recordingUrl
            )}`}
          />
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
  ];

  return (
    <div style={{ padding: 5 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          {
            title: 'Total Calls',
            value: calls.length,
            icon: <Phone size={20} />,
            color: '#1677ff',
          },
          {
            title: 'Completed',
            value: completed,
            icon: <TrendingUp size={20} />,
            color: '#52c41a',
          },
          {
            title: 'Total Duration',
            value: fmt(totalDuration),
            icon: <Clock size={20} />,
            color: '#13c2c2',
          },
          {
            title: 'Agents',
            value: new Set(calls.map((c) => c.userId?._id)).size,
            icon: <Users size={20} />,
            color: '#faad14',
          },
        ].map((s, i) => (
          <Col xs={12} md={6} key={i}>
            <Card
              bordered={false}
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    background: `${s.color}18`,
                    color: s.color,
                    borderRadius: 12,
                    padding: 12,
                    display: 'flex',
                  }}
                >
                  {s.icon}
                </div>
                <Statistic
                  title={s.title}
                  value={s.value}
                  valueStyle={{ fontSize: 22, fontWeight: 700 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        bordered={false}
        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
        title={<span style={{ fontWeight: 700 }}>Call Logs</span>}
      >
        <Table
          dataSource={calls}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          scroll={{ x: 1000 }}
          rowHoverable={false}
        />
      </Card>
    </div>
  );
};

export default CallLogs;
