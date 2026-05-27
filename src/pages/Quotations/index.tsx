import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  FilePdfOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import apiClient, { BASEURL } from '../../services/api/apiClient';
import { tokenStorage } from '../../services/auth/tokenStorage';
import useProducts from '../../services/useProducts';

const { Text } = Typography;

type BillTo = { name: string; phone: string; email: string; address: string };

const EMPTY_BILL: BillTo = { name: '', phone: '', email: '', address: '' };

const QuotationsPage = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [sourceType, setSourceType] = useState<'lead' | 'customer'>('lead');
  const [billTo, setBillTo] = useState<BillTo>(EMPTY_BILL);

  const { getProducts } = useProducts();

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/quotations');
      if (res.data?.success) setQuotations(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();

    getProducts({ limit: 1000 }).then((res: any) => {
      const body = res?.data ?? res;
      const list = body?.data?.products ?? body?.products ?? [];
      setAllProducts(Array.isArray(list) ? list : []);
    });

    apiClient
      .get('/leads')
      .then((res: any) => {
        const data = res.data?.data;
        setLeads(Array.isArray(data) ? data : []);
      })
      .catch(() => {});

    apiClient
      .get('/customers?limit=1000')
      .then((res: any) => {
        const data = res.data?.data;
        setCustomers(Array.isArray(data) ? data : data?.customers ?? []);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill billTo when lead/customer selected
  const handleSourceSelect = (id: string) => {
    if (sourceType === 'lead') {
      const l = leads.find((x: any) => x._id === id);
      if (l)
        setBillTo({
          name: l.name || '',
          phone: l.phone || '',
          email: l.email || '',
          address: [l.address, l.city, l.state, l.zip]
            .filter(Boolean)
            .join(', '),
        });
    } else {
      const c = customers.find((x: any) => x._id === id);
      if (c)
        setBillTo({
          name: c.name || '',
          phone: c.phone || '',
          email: c.email || '',
          address: [
            c.address?.street,
            c.address?.city,
            c.address?.state,
            c.address?.pincode,
          ]
            .filter(Boolean)
            .join(', '),
        });
    }
  };

  const openPdf = (id: string) => {
    const token = tokenStorage.getAccessToken();
    window.open(`${BASEURL}/api/quotations/${id}/pdf?token=${token}`, '_blank');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    form.resetFields();
    setBillTo(EMPTY_BILL);
    setSourceType('lead');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const products = (values.products || [])
        .filter((p: any) => p?.productId)
        .map((p: any) => ({
          productId: p.productId,
          price: p.price ?? 0,
          quantity: p.quantity ?? 1,
          ...(p.size != null ? { size: p.size } : {}),
        }));

      if (!products.length) {
        message.warning('Please add at least one product');
        return;
      }

      const payload: any = {
        products,
        tax: values.tax || 0,
        discount: values.discount || 0,
        billTo, // send edited billTo
      };
      if (sourceType === 'lead') payload.leadId = values.sourceId;
      else payload.customerId = values.sourceId;

      const res: any = await apiClient.post('/quotations/manual', payload);
      if (res.data?.success) {
        message.success('Quotation created!');
        closeDrawer();
        fetchQuotations();
        openPdf(res.data.data._id);
      } else {
        message.error(res.data?.message || 'Failed');
      }
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Quotation No',
      dataIndex: 'quotationNo',
      render: (v: string) => (
        <Text strong style={{ color: '#1677ff' }}>
          {v}
        </Text>
      ),
    },
    {
      title: 'Bill To',
      dataIndex: 'billTo',
      render: (b: any) =>
        b?.name ? (
          <div>
            <Text strong>{b.name}</Text>
            {b.phone && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {b.phone}
                </Text>
              </div>
            )}
            {b.email && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {b.email}
                </Text>
              </div>
            )}
          </div>
        ) : (
          '—'
        ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (s: string) => (
        <Tag color={s === 'activity' ? 'blue' : 'green'}>{s}</Tag>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'products',
      render: (p: any[]) => <Tag>{p?.length || 0} items</Tag>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (v: number) => (
        <Text strong>₹{(v || 0).toLocaleString('en-IN')}</Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString('en-IN'),
    },
    {
      title: 'PDF',
      key: 'pdf',
      render: (_: any, row: any) => (
        <Tooltip title="Download PDF">
          <Button
            type="text"
            icon={
              <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
            }
            onClick={() => openPdf(row._id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Text style={{ fontSize: 20, fontWeight: 700 }}>Quotations</Text>
          <div>
            <Text type="secondary">
              Auto-generated from activities + manually created
            </Text>
          </div>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchQuotations}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Create Quotation
          </Button>
        </Space>
      </Flex>

      <Card>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={quotations}
          loading={loading}
          rowHoverable={false}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No quotations yet"
              />
            ),
          }}
        />
      </Card>

      <Drawer
        title="Create Quotation"
        open={drawerOpen}
        onClose={closeDrawer}
        width={680}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>
              Create & Download PDF
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            products: [{ productId: undefined, quantity: 1, price: 0 }],
          }}
        >
          {/* ── Source toggle ── */}
          <Form.Item label="Bill To Source">
            <Flex gap={8}>
              <Button
                type={sourceType === 'lead' ? 'primary' : 'default'}
                onClick={() => {
                  setSourceType('lead');
                  form.setFieldValue('sourceId', undefined);
                  setBillTo(EMPTY_BILL);
                }}
              >
                From Lead
              </Button>
              <Button
                type={sourceType === 'customer' ? 'primary' : 'default'}
                onClick={() => {
                  setSourceType('customer');
                  form.setFieldValue('sourceId', undefined);
                  setBillTo(EMPTY_BILL);
                }}
              >
                From Customer
              </Button>
            </Flex>
          </Form.Item>

          <Form.Item
            name="sourceId"
            label={sourceType === 'lead' ? 'Select Lead' : 'Select Customer'}
            rules={[{ required: true, message: 'Please select' }]}
          >
            <Select
              showSearch
              allowClear
              placeholder={
                sourceType === 'lead' ? 'Search lead...' : 'Search customer...'
              }
              optionFilterProp="label"
              onChange={handleSourceSelect}
              onClear={() => setBillTo(EMPTY_BILL)}
              options={
                sourceType === 'lead'
                  ? leads.map((l: any) => ({
                      value: l._id,
                      label: `${l.name}${l.phone ? ' — ' + l.phone : ''}`,
                    }))
                  : customers.map((c: any) => ({
                      value: c._id,
                      label: `${c.name}${c.phone ? ' — ' + c.phone : ''}`,
                    }))
              }
            />
          </Form.Item>

          {/* ── Auto-fetched + editable Bill To details ── */}
          {(billTo.name || billTo.phone || billTo.email) && (
            <Card
              size="small"
              style={{
                marginBottom: 16,
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: 10,
              }}
              title={
                <Flex align="center" gap={6}>
                  <UserOutlined style={{ color: '#52c41a' }} />
                  <Text strong style={{ fontSize: 13 }}>
                    Bill To Details
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    (editable)
                  </Text>
                </Flex>
              }
            >
              <Row gutter={[12, 8]}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Name
                  </Text>
                  <Input
                    value={billTo.name}
                    onChange={(e) =>
                      setBillTo((p) => ({ ...p, name: e.target.value }))
                    }
                    size="small"
                  />
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Phone
                  </Text>
                  <Input
                    value={billTo.phone}
                    onChange={(e) =>
                      setBillTo((p) => ({ ...p, phone: e.target.value }))
                    }
                    size="small"
                  />
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Email
                  </Text>
                  <Input
                    value={billTo.email}
                    onChange={(e) =>
                      setBillTo((p) => ({ ...p, email: e.target.value }))
                    }
                    size="small"
                  />
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Address
                  </Text>
                  <Input
                    value={billTo.address}
                    onChange={(e) =>
                      setBillTo((p) => ({ ...p, address: e.target.value }))
                    }
                    size="small"
                  />
                </Col>
              </Row>
            </Card>
          )}

          <Divider style={{ margin: '8px 0 16px' }} />

          {/* ── Products ── */}
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <div>
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ marginBottom: 8 }}
                >
                  <Text strong>Products</Text>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      add({ productId: undefined, quantity: 1, price: 0 })
                    }
                  >
                    Add Row
                  </Button>
                </Flex>

                {fields.map(({ key, name }) => (
                  <Form.Item key={key} noStyle shouldUpdate>
                    {() => {
                      const productId = form.getFieldValue([
                        'products',
                        name,
                        'productId',
                      ]);
                      const found = allProducts.find(
                        (p: any) => p._id === productId
                      );
                      const sizes: number[] = found?.availableSize?.length
                        ? found.availableSize
                        : [];

                      return (
                        <Card
                          size="small"
                          style={{ marginBottom: 8, background: '#fafafa' }}
                        >
                          <Row gutter={[8, 6]} align="middle">
                            <Col span={22}>
                              <Form.Item
                                name={[name, 'productId']}
                                noStyle
                                rules={[
                                  { required: true, message: 'Select product' },
                                ]}
                              >
                                <Select
                                  showSearch
                                  placeholder="Select product"
                                  style={{ width: '100%' }}
                                  optionFilterProp="label"
                                  options={allProducts.map((p: any) => ({
                                    value: p._id,
                                    label: p.name,
                                  }))}
                                  onChange={(val) => {
                                    const p = allProducts.find(
                                      (ap: any) => ap._id === val
                                    );
                                    if (p) {
                                      form.setFieldValue(
                                        ['products', name, 'price'],
                                        p.price ?? 0
                                      );
                                      form.setFieldValue(
                                        ['products', name, 'size'],
                                        undefined
                                      );
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={2} style={{ textAlign: 'right' }}>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Col>

                            {sizes.length > 0 && (
                              <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  Size ({found?.unit})
                                </Text>
                                <Form.Item name={[name, 'size']} noStyle>
                                  <Select
                                    placeholder="Select size"
                                    style={{ width: '100%' }}
                                    allowClear
                                    options={sizes.map((s) => ({
                                      value: s,
                                      label: `${s} ${found?.unit}`,
                                    }))}
                                  />
                                </Form.Item>
                              </Col>
                            )}

                            <Col span={sizes.length > 0 ? 8 : 12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                Price (₹)
                              </Text>
                              <Form.Item name={[name, 'price']} noStyle>
                                <InputNumber
                                  style={{ width: '100%' }}
                                  min={0}
                                  placeholder="Price"
                                />
                              </Form.Item>
                            </Col>

                            <Col span={sizes.length > 0 ? 8 : 12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                Quantity
                              </Text>
                              <Form.Item name={[name, 'quantity']} noStyle>
                                <InputNumber
                                  style={{ width: '100%' }}
                                  min={1}
                                  placeholder="Qty"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      );
                    }}
                  </Form.Item>
                ))}
              </div>
            )}
          </Form.List>

          <Row gutter={12} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Form.Item name="tax" label="Tax (₹)">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discount" label="Discount (₹)">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default QuotationsPage;
