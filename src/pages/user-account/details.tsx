import { useEffect } from 'react';
import { Button, Col, Form, Input, Radio, Row, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Card } from '../../components';
import { useOutletContext } from 'react-router-dom';
import type { UserProfileData } from '../../layouts/user-account';

type FieldType = {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  role?: string;
  status?: 'active' | 'inactive';
};

type OutletContextType = {
  user: UserProfileData | null;
};

const formatValue = (value?: string | null) => {
  if (!value) {
    return '';
  }

  return value.trim();
};

export const UserProfileDetailsPage = () => {
  const [form] = Form.useForm<FieldType>();
  const { user } = useOutletContext<OutletContextType>();

  useEffect(() => {
    form.setFieldsValue({
      id: user?._id ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      fullName:
        user?.name ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      department: formatValue(user?.department),
      position: formatValue(user?.position),
      role: formatValue(user?.roleId?.name),
      status: user?.status === 'inactive' ? 'inactive' : 'active',
    });
  }, [form, user]);

  const onFinish = (values: FieldType) => {
    console.log('Profile details form values:', values);
  };

  return (
    <Card>
      <Form
        form={form}
        name="user-profile-details-form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="on"
        requiredMark={false}
      >
        <Row gutter={[16, 0]}>
          <Col sm={24} lg={24}>
            <Form.Item<FieldType>
              label="User ID"
              name="id"
              rules={[{ required: true, message: 'User ID is required' }]}
            >
              <Input
                readOnly
                suffix={
                  user?._id ? (
                    <Typography.Paragraph
                      copyable={{ text: user._id }}
                      style={{ margin: 0 }}
                    />
                  ) : null
                }
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType>
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType>
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType>
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Full name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType> label="Phone" name="phone">
              <Input />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType> label="Role" name="role">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType> label="Department" name="department">
              <Input />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item<FieldType> label="Position" name="position">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Status is required' }]}
            >
              <Radio.Group>
                <Radio value="active">Active</Radio>
                <Radio value="inactive">Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
