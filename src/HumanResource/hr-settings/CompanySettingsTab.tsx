import { Card, Col, Form, Input, Row, Statistic, Tag, Typography } from 'antd';
import { useHrSettingsContext } from './context';

const { Text } = Typography;

const weekLabelMap: Record<string, string> = {
  first: '1st',
  second: '2nd',
  third: '3rd',
  fourth: '4th',
  last: 'Last',
};

const CompanySettingsTab = () => {
  const { form, setCompanyName } = useHrSettingsContext();

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={16}>
        <Card bordered={false}>
          <Form layout="vertical">
            <Form.Item label="Company Name">
              <Input
                placeholder="Enter company name"
                value={form.companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Col xs={24} xl={8}>
        <Card bordered={false} title="Configuration Summary">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Statistic
                title="Working Days"
                value={form.salaryRules.workingDaysPerMonth}
                suffix="/ month"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Leave Policies"
                value={form.leavePolicies.length}
              />
            </Col>
            <Col span={12}>
              <Statistic title="Shifts" value={form.shifts.length} />
            </Col>
            <Col span={12}>
              <Statistic title="Holidays" value={form.holidays.length} />
            </Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Weekly Offs</Text>
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {form.weeklyOffPolicy.fixedDays.map((day) => (
                <Tag key={day} color="blue">
                  {day}
                </Tag>
              ))}
              {form.weeklyOffPolicy.monthlyPatterns.map((pattern, index) => (
                <Tag
                  key={`${pattern.week}-${pattern.day}-${index}`}
                  color="purple"
                >
                  {weekLabelMap[pattern.week] || pattern.week} {pattern.day}
                </Tag>
              ))}
              {form.weeklyOffPolicy.fixedDays.length === 0 &&
              form.weeklyOffPolicy.monthlyPatterns.length === 0 ? (
                <Text type="secondary">No weekly off rules configured</Text>
              ) : null}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default CompanySettingsTab;
