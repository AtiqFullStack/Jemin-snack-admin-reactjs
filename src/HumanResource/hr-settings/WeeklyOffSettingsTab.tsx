import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Flex,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { useOutletContext } from 'react-router-dom';
import {
  MONTHLY_OFF_WEEKS,
  WEEK_DAYS,
  type HrSettingsContextValue,
  type HrMonthlyOffPattern,
} from './types';

const { Text } = Typography;

const weekOptions = MONTHLY_OFF_WEEKS.map((week) => ({
  label: week.charAt(0).toUpperCase() + week.slice(1),
  value: week,
}));

const dayOptions = WEEK_DAYS.map((day) => ({
  label: day,
  value: day,
}));

const WeeklyOffSettingsTab = () => {
  const {
    form,
    toggleWeeklyOff,
    addMonthlyOffPattern,
    updateMonthlyOffPattern,
    removeMonthlyOffPattern,
  } = useOutletContext<HrSettingsContextValue>();

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card bordered={false} title="Fixed Weekly Offs">
        <Flex wrap="wrap" gap={16}>
          {WEEK_DAYS.map((day) => (
            <Checkbox
              key={day}
              checked={form.weeklyOffPolicy.fixedDays.includes(day)}
              onChange={() => toggleWeeklyOff(day)}
            >
              {day}
            </Checkbox>
          ))}
        </Flex>
      </Card>

      <Card
        bordered={false}
        title="Monthly Off Patterns"
        extra={
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addMonthlyOffPattern}
          >
            Add Pattern
          </Button>
        }
      >
        <Space direction="vertical" size={12} style={{ display: 'flex' }}>
          <Text type="secondary">
            Use this for rules like 2nd Saturday off, 4th Saturday off, or last
            Friday off.
          </Text>

          {form.weeklyOffPolicy.monthlyPatterns.length === 0 ? (
            <Empty description="No monthly off patterns added" />
          ) : null}

          {form.weeklyOffPolicy.monthlyPatterns.map((pattern, index) => (
            <Card
              key={`${pattern.week}-${pattern.day}-${index}`}
              size="small"
              bodyStyle={{ paddingBottom: 8 }}
              extra={
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeMonthlyOffPattern(index)}
                >
                  Remove
                </Button>
              }
            >
              <Row gutter={12} align="middle">
                <Col xs={24} md={10}>
                  <Select
                    style={{ width: '100%' }}
                    value={pattern.week}
                    options={weekOptions}
                    onChange={(value) =>
                      updateMonthlyOffPattern(
                        index,
                        'week',
                        value as HrMonthlyOffPattern['week']
                      )
                    }
                  />
                </Col>
                <Col xs={24} md={10}>
                  <Select
                    style={{ width: '100%' }}
                    value={pattern.day}
                    options={dayOptions}
                    onChange={(value) =>
                      updateMonthlyOffPattern(index, 'day', value)
                    }
                  />
                </Col>
                <Col xs={24} md={4}>
                  <Text type="secondary">{index + 1}</Text>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      </Card>
    </Space>
  );
};

export default WeeklyOffSettingsTab;
