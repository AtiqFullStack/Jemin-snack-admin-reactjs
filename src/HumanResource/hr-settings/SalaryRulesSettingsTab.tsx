import { Card, Col, Form, InputNumber, Row, Switch } from 'antd';
import { useHrSettingsContext } from './context';

const SalaryRulesSettingsTab = () => {
  const { form, updateSalary } = useHrSettingsContext();

  return (
    <Card bordered={false}>
      <Form layout="vertical">
        <Row gutter={16}>
          {/* 🔥 NEW SWITCH */}
          <Col xs={24} md={12} xl={6}>
            <Form.Item label="Salary Calculation Type">
              <Switch
                checked={
                  form.salaryRules.salaryCalculationType === 'FULL_MONTH'
                }
                checkedChildren="30 Days"
                unCheckedChildren="Working Days"
                onChange={(checked) =>
                  updateSalary(
                    'salaryCalculationType',
                    checked ? 'FULL_MONTH' : 'WORKING_DAYS'
                  )
                }
              />
            </Form.Item>
          </Col>
          {/* 
          <Col xs={24} md={12} xl={6}>
            <Form.Item label="Working Days Per Month">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.salaryRules.workingDaysPerMonth}
                onChange={(value) =>
                  updateSalary('workingDaysPerMonth', Number(value ?? 0))
                }
              />
            </Form.Item>
          </Col> */}

          <Col xs={24} md={12} xl={6}>
            <Form.Item label="Daily Working Hours">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.salaryRules.dailyWorkingHours}
                onChange={(value) =>
                  updateSalary('dailyWorkingHours', Number(value ?? 0))
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Form.Item label="Overtime Rate Per Hour">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.salaryRules.overtimeRatePerHour}
                onChange={(value) =>
                  updateSalary('overtimeRatePerHour', Number(value ?? 0))
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Form.Item label="Late Penalty Per Minute">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={form.salaryRules.latePenaltyPerMinute}
                onChange={(value) =>
                  updateSalary('latePenaltyPerMinute', Number(value ?? 0))
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SalaryRulesSettingsTab;
