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
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import apiClient, { BASEURL } from '../../services/api/apiClient';
import { tokenStorage } from '../../services/auth/tokenStorage';
import useProducts from '../../services/useProducts';
import { usePermissions } from '../../hooks/usePermissions';

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

  // cart state
  type CartRow = {
    productId: string;
    size: number | undefined;
    price: number;
    quantity: number;
  };
  const [cart, setCart] = useState<CartRow[]>([]);
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const total = subtotal + tax - discount;

  const { getProducts } = useProducts();
  const { canCreate } = usePermissions();

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
    setCart([]);
    setTax(0);
    setDiscount(0);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!cart.length) {
        message.warning('Please add at least one product');
        return;
      }
      setSaving(true);

      const products = cart.map((c) => ({
        productId: c.productId,
        price: c.price,
        quantity: c.quantity,
        ...(c.size != null ? { size: c.size } : {}),
      }));

      const payload: any = { products, tax, discount, billTo };
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
          {canCreate('quotations') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Create Quotation
            </Button>
          )}
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
        <Form form={form} layout="vertical">
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
          <div>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 10 }}
            >
              <Text strong style={{ fontSize: 14 }}>
                Products
              </Text>
              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() =>
                  setCart((prev) => [
                    ...prev,
                    { productId: '', size: undefined, price: 0, quantity: 1 },
                  ])
                }
              >
                Add Product
              </Button>
            </Flex>

            {cart.length === 0 && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No products added"
                style={{ margin: '16px 0' }}
              />
            )}

            {cart.map((item, idx) => {
              const found = allProducts.find(
                (p: any) => p._id === item.productId
              );
              return (
                <Card
                  key={idx}
                  size="small"
                  style={{
                    marginBottom: 10,
                    borderRadius: 10,
                    border: '1px solid #e8e8e8',
                    background: '#fafafa',
                  }}
                >
                  <Flex gap={8} align="flex-start">
                    {/* product image */}
                    {found?.image ? (
                      <img
                        src={`${BASEURL}/${found.image}`}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ShoppingOutlined
                          style={{ color: '#bbb', fontSize: 20 }}
                        />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* product select */}
                      <Select
                        showSearch
                        placeholder="Select product"
                        style={{ width: '100%', marginBottom: 8 }}
                        optionFilterProp="label"
                        value={item.productId || undefined}
                        options={allProducts.map((p: any) => ({
                          value: p._id,
                          label: p.name,
                        }))}
                        onChange={(val) => {
                          // just set product, reset size & price — no auto-merge on product select
                          setCart((prev) =>
                            prev.map((c, i) =>
                              i === idx
                                ? {
                                    ...c,
                                    productId: val,
                                    size: undefined,
                                    price: 0,
                                  }
                                : c
                            )
                          );
                        }}
                      />

                      <Row gutter={8}>
                        {/* size select from prices array */}
                        {found?.prices?.length > 0 && (
                          <Col span={8}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              Size
                            </Text>
                            <Select
                              size="small"
                              style={{ width: '100%' }}
                              value={item.size}
                              placeholder="Select size"
                              options={found.prices.map((pr: any) => ({
                                value: pr.size,
                                label: `${pr.size} ${found.unit}`,
                              }))}
                              onChange={(val) => {
                                const pr = found.prices.find(
                                  (p: any) => p.size === val
                                );
                                const newPrice = pr?.price ?? item.price;
                                setCart((prev) => {
                                  const dupIdx = prev.findIndex(
                                    (c, i) =>
                                      i !== idx &&
                                      c.productId === item.productId &&
                                      c.size === val
                                  );
                                  if (dupIdx !== -1) {
                                    return prev
                                      .map((c, i) =>
                                        i === dupIdx
                                          ? {
                                              ...c,
                                              quantity:
                                                c.quantity + item.quantity,
                                            }
                                          : c
                                      )
                                      .filter((_, i) => i !== idx);
                                  }
                                  return prev.map((c, i) =>
                                    i === idx
                                      ? { ...c, size: val, price: newPrice }
                                      : c
                                  );
                                });
                              }}
                            />
                          </Col>
                        )}

                        <Col span={found?.prices?.length > 0 ? 8 : 12}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Price (₹)
                          </Text>
                          <InputNumber
                            size="small"
                            style={{ width: '100%', background: '#f5f5f5' }}
                            min={0}
                            value={item.price}
                            readOnly
                          />
                        </Col>

                        <Col span={found?.prices?.length > 0 ? 8 : 12}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Qty
                          </Text>
                          <InputNumber
                            size="small"
                            style={{ width: '100%' }}
                            min={1}
                            value={item.quantity}
                            onChange={(v) =>
                              setCart((prev) =>
                                prev.map((c, i) =>
                                  i === idx ? { ...c, quantity: v ?? 1 } : c
                                )
                              )
                            }
                          />
                        </Col>
                      </Row>
                    </div>

                    <Flex align="center" gap={4} style={{ flexShrink: 0 }}>
                      <Text
                        strong
                        style={{
                          color: '#389e0d',
                          fontSize: 13,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </Text>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          setCart((prev) => prev.filter((_, i) => i !== idx))
                        }
                      />
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </div>

          {/* ── Summary ── */}
          {cart.length > 0 && (
            <Card
              size="small"
              style={{
                marginTop: 8,
                borderRadius: 10,
                background: '#f6ffed',
                border: '1px solid #d9f7be',
              }}
            >
              <Row gutter={[16, 8]} align="middle">
                <Col span={24}>
                  <Flex justify="space-between">
                    <Text type="secondary">Subtotal</Text>
                    <Text strong>₹{subtotal.toLocaleString('en-IN')}</Text>
                  </Flex>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tax (₹)
                  </Text>
                  <InputNumber
                    size="small"
                    style={{ width: '100%' }}
                    min={0}
                    value={tax}
                    onChange={(v) => setTax(v ?? 0)}
                  />
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Discount (₹)
                  </Text>
                  <InputNumber
                    size="small"
                    style={{ width: '100%' }}
                    min={0}
                    value={discount}
                    onChange={(v) => setDiscount(v ?? 0)}
                  />
                </Col>
                <Col span={24}>
                  <Divider style={{ margin: '6px 0' }} />
                  <Flex justify="space-between" align="center">
                    <Text strong style={{ fontSize: 15 }}>
                      Total
                    </Text>
                    <Text strong style={{ fontSize: 18, color: '#389e0d' }}>
                      ₹{total.toLocaleString('en-IN')}
                    </Text>
                  </Flex>
                </Col>
              </Row>
            </Card>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default QuotationsPage;
