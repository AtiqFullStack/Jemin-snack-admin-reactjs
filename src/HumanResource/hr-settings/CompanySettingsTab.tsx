import { Card, Form, Input } from 'antd';
import { useOutletContext } from 'react-router-dom';
import type { HrSettingsContextValue } from './types';

const CompanySettingsTab = () => {
  const { form, setCompanyName } = useOutletContext<HrSettingsContextValue>();

  return (
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
  );
};

export default CompanySettingsTab;
