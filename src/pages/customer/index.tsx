import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Table,
  Tag,
  Typography,
  message,
  Checkbox,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

type Customer = {
  id: string;

  company: string;
  vat_number?: string;
  phone?: string;
  website?: string;

  group?: string;
  currency?: string;
  language?: string;

  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;

  billing?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };

  shipping?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };

  created_at: string; // YYYY-MM-DD
};

type CustomerFormValues = {
  company: string;
  vat_number?: string;
  phone?: string;
  website?: string;

  group?: string;
  currency?: string;
  language?: string;

  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;

  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;

  shipping_street?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;

  same_as_customer?: boolean; // Shipping same as customer info
  copy_billing_to_shipping?: boolean; // Copy billing -> shipping
};

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CU-1001',
    company: 'ABC Pvt Ltd',
    vat_number: 'VAT-12345',
    phone: '+91 98765 43210',
    website: 'https://abc.com',
    group: 'VIP',
    currency: 'System Default',
    language: 'System Default',
    address: 'MG Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560001',
    country: 'India',
    billing: {
      street: 'MG Road, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560001',
      country: 'India',
    },
    shipping: {
      street: 'Warehouse Rd, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560010',
      country: 'India',
    },
    created_at: '2026-02-16',
  },
  {
    id: 'CU-1002',
    company: 'TechNova',
    vat_number: 'VAT-77880',
    phone: '+91 91234 56789',
    website: 'https://technova.io',
    group: 'Default',
    currency: 'System Default',
    language: 'English',
    address: 'Sector 62',
    city: 'Noida',
    state: 'UP',
    zip: '201301',
    country: 'India',
    billing: {
      street: 'Sector 62',
      city: 'Noida',
      state: 'UP',
      zip: '201301',
      country: 'India',
    },
    shipping: {
      street: 'Sector 62',
      city: 'Noida',
      state: 'UP',
      zip: '201301',
      country: 'India',
    },
    created_at: '2026-02-15',
  },
];

const GROUP_OPTIONS = ['Default', 'VIP', 'Wholesale'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UAE'];
const CURRENCY_OPTIONS = ['System Default', 'USD', 'INR', 'AED'];
const LANGUAGE_OPTIONS = ['System Default', 'English', 'Hindi'];

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [form] = Form.useForm<CustomerFormValues>();

  const columns: ColumnsType<Customer> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 110 },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (v) => <Typography.Text strong>{v}</Typography.Text>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (v) => v || '—',
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (v) => v || '—',
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      width: 120,
      render: (v) => (v ? <Tag>{v}</Tag> : '—'),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 120,
      render: (v) => v || '—',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: () => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  const openNewCustomer = () => {
    setDrawerOpen(true);
    setActiveTab('details');
    form.resetFields();
    form.setFieldsValue({
      currency: 'System Default',
      language: 'System Default',
      same_as_customer: false,
      copy_billing_to_shipping: false,
    });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    form.resetFields();
  };

  const applyShippingSameAsCustomer = () => {
    const v = form.getFieldsValue();
    form.setFieldsValue({
      shipping_street: v.address,
      shipping_city: v.city,
      shipping_state: v.state,
      shipping_zip: v.zip,
      shipping_country: v.country,
    });
  };

  const copyBillingToShipping = () => {
    const v = form.getFieldsValue();
    form.setFieldsValue({
      shipping_street: v.billing_street,
      shipping_city: v.billing_city,
      shipping_state: v.billing_state,
      shipping_zip: v.billing_zip,
      shipping_country: v.billing_country,
    });
  };

  const saveCustomer = async (createContact = false) => {
    const values = await form.validateFields();

    const nextId = `CU-${1000 + customers.length + 1}`;
    const today = new Date().toISOString().split('T')[0];

    const newCustomer: Customer = {
      id: nextId,
      company: values.company,
      vat_number: values.vat_number,
      phone: values.phone,
      website: values.website,
      group: values.group,
      currency: values.currency,
      language: values.language,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      country: values.country,
      billing: {
        street: values.billing_street,
        city: values.billing_city,
        state: values.billing_state,
        zip: values.billing_zip,
        country: values.billing_country,
      },
      shipping: {
        street: values.shipping_street,
        city: values.shipping_city,
        state: values.shipping_state,
        zip: values.shipping_zip,
        country: values.shipping_country,
      },
      created_at: today,
    };

    setCustomers([newCustomer, ...customers]);
    message.success(
      createContact
        ? 'Saved + create contact (static)'
        : 'Customer saved (static)'
    );
    closeDrawer();
  };

  return (
    <div style={{ padding: 16 }}>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Customers
        </Typography.Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openNewCustomer}
        >
          New Customer
        </Button>
      </Flex>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={customers}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 900 }}
          rowHoverable={false}
        />
      </Card>

      <Drawer
        title="Add New Customer"
        open={drawerOpen}
        onClose={closeDrawer}
        width={980}
        extra={
          <Space>
            <Button onClick={() => saveCustomer(true)}>
              Save and create contact
            </Button>
            <Button type="primary" onClick={() => saveCustomer(false)}>
              Save
            </Button>
          </Space>
        }
        styles={{ body: { paddingBottom: 24 } }}
      >
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={(k) => setActiveTab(k)}
            items={[
              {
                key: 'details',
                label: 'Customer Details',
                children: (
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="company"
                      label={
                        <>
                          <span style={{ color: 'red' }}>*</span> Company
                        </>
                      }
                      rules={[
                        { required: true, message: 'Company is required' },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item name="vat_number" label="VAT Number">
                      <Input />
                    </Form.Item>

                    <Form.Item name="phone" label="Phone">
                      <Input />
                    </Form.Item>

                    <Form.Item name="website" label="Website">
                      <Input />
                    </Form.Item>

                    {/* Groups + plus (dropdown add) */}
                    <Form.Item label="Groups">
                      <Row gutter={8} align="middle">
                        <Col flex="auto">
                          <Form.Item name="group" noStyle>
                            <Select
                              placeholder="Nothing selected"
                              options={GROUP_OPTIONS.map((g) => ({
                                value: g,
                                label: g,
                              }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Button icon={<PlusOutlined />} disabled />
                        </Col>
                      </Row>
                    </Form.Item>

                    <Row gutter={12}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="currency"
                          label={
                            <>
                              <span style={{ color: 'red' }}>*</span> Currency
                            </>
                          }
                          rules={[{ required: true }]}
                        >
                          <Select
                            options={CURRENCY_OPTIONS.map((c) => ({
                              value: c,
                              label: c,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="language" label="Default Language">
                          <Select
                            options={LANGUAGE_OPTIONS.map((l) => ({
                              value: l,
                              label: l,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="address" label="Address">
                      <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="city" label="City">
                      <Input />
                    </Form.Item>

                    <Form.Item name="state" label="State">
                      <Input />
                    </Form.Item>

                    <Form.Item name="zip" label="Zip Code">
                      <Input />
                    </Form.Item>

                    <Form.Item name="country" label="Country">
                      <Select
                        placeholder="Nothing selected"
                        options={COUNTRY_OPTIONS.map((c) => ({
                          value: c,
                          label: c,
                        }))}
                      />
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'billing',
                label: 'Billing & Shipping',
                children: (
                  <Form form={form} layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Typography.Text strong>
                          Billing Address
                        </Typography.Text>

                        <Form.Item
                          name="billing_street"
                          label="Street"
                          style={{ marginTop: 8 }}
                        >
                          <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="billing_city" label="City">
                          <Input />
                        </Form.Item>
                        <Form.Item name="billing_state" label="State">
                          <Input />
                        </Form.Item>
                        <Form.Item name="billing_zip" label="Zip Code">
                          <Input />
                        </Form.Item>
                        <Form.Item name="billing_country" label="Country">
                          <Select
                            placeholder="Nothing selected"
                            options={COUNTRY_OPTIONS.map((c) => ({
                              value: c,
                              label: c,
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Flex justify="space-between" align="center">
                          <Typography.Text strong>
                            Shipping Address
                          </Typography.Text>

                          <Space>
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked)
                                  applyShippingSameAsCustomer();
                              }}
                            >
                              Same as Customer Info
                            </Checkbox>

                            <Button
                              size="small"
                              onClick={copyBillingToShipping}
                            >
                              Copy Billing Address
                            </Button>
                          </Space>
                        </Flex>

                        <Form.Item
                          name="shipping_street"
                          label="Street"
                          style={{ marginTop: 8 }}
                        >
                          <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="shipping_city" label="City">
                          <Input />
                        </Form.Item>
                        <Form.Item name="shipping_state" label="State">
                          <Input />
                        </Form.Item>
                        <Form.Item name="shipping_zip" label="Zip Code">
                          <Input />
                        </Form.Item>
                        <Form.Item name="shipping_country" label="Country">
                          <Select
                            placeholder="Nothing selected"
                            options={COUNTRY_OPTIONS.map((c) => ({
                              value: c,
                              label: c,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                ),
              },
            ]}
          />
        </Card>
      </Drawer>
    </div>
  );
};

export default CustomersPage;
