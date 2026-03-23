import { Card, Col, Form, InputNumber, Row } from 'antd';
import { useOutletContext } from 'react-router-dom';
import type { HrSettingsContextValue } from './types';

const LeavePolicySettingsTab = () => {
  const { form, updateLeave } = useOutletContext<HrSettingsContextValue>();

  return (
    <Card bordered={false}>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Casual Leaves">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.leavePolicy.casualLeaves}
                onChange={(value) =>
                  updateLeave('casualLeaves', Number(value || 0))
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Sick Leaves">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.leavePolicy.sickLeaves}
                onChange={(value) =>
                  updateLeave('sickLeaves', Number(value || 0))
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Paid Leaves">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.leavePolicy.paidLeaves}
                onChange={(value) =>
                  updateLeave('paidLeaves', Number(value || 0))
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default LeavePolicySettingsTab;
