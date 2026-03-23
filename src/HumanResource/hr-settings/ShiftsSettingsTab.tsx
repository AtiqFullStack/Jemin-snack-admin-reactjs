import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import { useOutletContext } from 'react-router-dom';
import type { HrSettingsContextValue } from './types';

const ShiftsSettingsTab = () => {
  const { form, addShift, updateShift, removeShift } =
    useOutletContext<HrSettingsContextValue>();

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Button type="dashed" icon={<PlusOutlined />} onClick={addShift}>
        Add Shift
      </Button>

      {form.shifts.length === 0 ? (
        <Empty description="No shifts added" />
      ) : null}

      {form.shifts.map((shift, index) => (
        <Card
          key={`${shift.name || 'shift'}-${index}`}
          bordered={false}
          title={shift.name || `Shift ${index + 1}`}
          extra={
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => removeShift(index)}
            >
              Remove
            </Button>
          }
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Shift Name">
                  <Input
                    value={shift.name}
                    onChange={(event) =>
                      updateShift(index, 'name', event.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={5}>
                <Form.Item label="Start Time">
                  <TimePicker
                    format="HH:mm"
                    value={
                      shift.startTime ? dayjs(shift.startTime, 'HH:mm') : null
                    }
                    onChange={(_, timeString) =>
                      updateShift(index, 'startTime', String(timeString || ''))
                    }
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={5}>
                <Form.Item label="End Time">
                  <TimePicker
                    format="HH:mm"
                    value={shift.endTime ? dayjs(shift.endTime, 'HH:mm') : null}
                    onChange={(_, timeString) =>
                      updateShift(index, 'endTime', String(timeString || ''))
                    }
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Break Minutes">
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    value={shift.breakTimeMinutes}
                    onChange={(value) =>
                      updateShift(index, 'breakTimeMinutes', Number(value || 0))
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ))}
    </Space>
  );
};

export default ShiftsSettingsTab;
