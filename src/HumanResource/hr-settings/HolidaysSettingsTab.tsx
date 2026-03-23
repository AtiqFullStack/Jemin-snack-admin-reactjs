import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Row,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { useOutletContext } from 'react-router-dom';
import type { HrSettingsContextValue } from './types';

const HolidaysSettingsTab = () => {
  const { form, addHoliday, updateHoliday, removeHoliday } =
    useOutletContext<HrSettingsContextValue>();

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Button type="dashed" icon={<PlusOutlined />} onClick={addHoliday}>
        Add Holiday
      </Button>

      {form.holidays.length === 0 ? (
        <Empty description="No holidays added" />
      ) : null}

      {form.holidays.map((holiday, index) => (
        <Card
          key={`${holiday.name || 'holiday'}-${index}`}
          bordered={false}
          title={holiday.name || `Holiday ${index + 1}`}
          extra={
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => removeHoliday(index)}
            >
              Remove
            </Button>
          }
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={14}>
                <Form.Item label="Holiday Name">
                  <Input
                    value={holiday.name}
                    onChange={(event) =>
                      updateHoliday(index, 'name', event.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={10}>
                <Form.Item label="Date">
                  <DatePicker
                    style={{ width: '100%' }}
                    value={holiday.date ? dayjs(holiday.date) : null}
                    onChange={(_, dateString) =>
                      updateHoliday(index, 'date', String(dateString || ''))
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

export default HolidaysSettingsTab;
