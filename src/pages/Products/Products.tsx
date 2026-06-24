import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AppstoreAddOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TagsOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { BASEURL } from 'src/services/api/apiClient';
import useProducts from 'src/services/useProducts';
import { usePermissions } from 'src/hooks';

const { Text, Title } = Typography;
const { TextArea } = Input;

type ProductType = {
  _id: string;
  name: string;
};

type ProductCategory = ProductType | string | null | undefined;

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  category?: ProductCategory;
  prices?: { size: number; price: number }[];
  unit?: string;
  quantity?: number;
  isActive?: boolean;
};

type ProductFormValues = {
  name: string;
  description: string;
  category: string;
  unit: string;
  prices: { size: number; price: number }[];
  isActive: boolean;
};

const SizePriceSelect = ({
  prices,
  unit,
}: {
  prices: { size: number; price: number }[];
  unit?: string;
}) => {
  const first = prices[0];
  const [selected, setSelected] = useState<number>(first?.size);
  const price = prices.find((p) => p.size === selected)?.price;
  return (
    <Space size={4}>
      <Select
        size="small"
        style={{ width: 73 }}
        value={selected}
        onChange={setSelected}
        options={prices.map((p) => ({
          value: p.size,
          label: `${p.size} ${unit || ''}`,
        }))}
      />
      {price != null && (
        <Text style={{ fontSize: 15, color: '#389e0d', whiteSpace: 'nowrap' }}>
          ₹{price}
        </Text>
      )}
    </Space>
  );
};

const PRESET_SIZES = [14, 16, 18, 20, 28, 30, 32, 36, 38, 40];
const CUSTOM_SIZES_KEY = 'jemini_custom_sizes';

const getCustomSizes = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_SIZES_KEY) || '[]');
  } catch {
    return [];
  }
};
const saveCustomSizes = (sizes: number[]) => {
  localStorage.setItem(CUSTOM_SIZES_KEY, JSON.stringify(sizes));
};

const SizeInput = ({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v?: number) => void;
}) => {
  const [inputVal, setInputVal] = useState('');
  const [open, setOpen] = useState(false);
  const [customSizes, setCustomSizes] = useState<number[]>(getCustomSizes);

  const allSizes = useMemo(() => {
    const merged = [...new Set([...PRESET_SIZES, ...customSizes])].sort(
      (a, b) => a - b
    );
    return merged;
  }, [customSizes]);

  const addCustomSize = (v: number) => {
    if (!allSizes.includes(v)) {
      const updated = [...customSizes, v];
      setCustomSizes(updated);
      saveCustomSizes(updated);
    }
    onChange?.(v);
    setInputVal('');
    setOpen(false);
  };

  const removeCustomSize = (v: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = customSizes.filter((s) => s !== v);
    setCustomSizes(updated);
    saveCustomSizes(updated);
    if (value === v) onChange?.(undefined);
  };

  const typedNum = Number(inputVal);
  const isValidCustom =
    inputVal !== '' &&
    !isNaN(typedNum) &&
    typedNum > 0 &&
    !allSizes.includes(typedNum);

  const filteredSizes = allSizes.filter((s) =>
    inputVal ? String(s).includes(inputVal) : true
  );

  const options = filteredSizes.map((s) => ({
    value: s,
    label: (
      <Flex justify="space-between" align="center">
        <span>{s}</span>
        {customSizes.includes(s) && (
          <CloseOutlined
            style={{ fontSize: 10, color: '#ff4d4f' }}
            onClick={(e) => removeCustomSize(s, e as any)}
          />
        )}
      </Flex>
    ),
  }));

  if (value != null) {
    return (
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          padding: '3px 8px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          minHeight: 32,
        }}
      >
        <Tag
          closable
          onClose={() => onChange?.(undefined)}
          color="blue"
          style={{ margin: 0, fontSize: 13 }}
        >
          {value}
        </Tag>
      </div>
    );
  }

  return (
    <Select
      showSearch
      open={open}
      onDropdownVisibleChange={setOpen}
      placeholder="Type or select a size"
      style={{ width: '100%' }}
      searchValue={inputVal}
      onSearch={setInputVal}
      value={undefined}
      onChange={(v: number) => {
        onChange?.(v);
        setInputVal('');
        setOpen(false);
      }}
      filterOption={false}
      onInputKeyDown={(e) => {
        if (e.key === 'Enter' && isValidCustom) {
          e.preventDefault();
          e.stopPropagation();
          addCustomSize(typedNum);
        }
      }}
      dropdownRender={(menu) => (
        <>
          {menu}
          {isValidCustom && (
            <div
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
                color: '#1677ff',
                borderTop: '1px solid #f0f0f0',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                addCustomSize(typedNum);
              }}
            >
              <PlusOutlined style={{ marginRight: 6 }} />
              Add <strong>{typedNum}</strong> to list
            </div>
          )}
        </>
      )}
      options={options}
    />
  );
};

const Products = () => {
  const {
    getTypes,
    createTypes,
    updateTypes,
    deleteTypes,
    getProducts,
    createProducts,
    updateProducts,
    deleteProducts,
  } = useProducts();

  const { canCreate, canUpdate, canDelete } = usePermissions();

  const [types, setTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [savingType, setSavingType] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [typeModal, setTypeModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>();

  const [typeForm] = Form.useForm<Pick<ProductType, 'name'>>();
  const [productForm] = Form.useForm<ProductFormValues>();

  const getCategoryId = (category: ProductCategory) =>
    typeof category === 'string' ? category : category?._id;

  const getCategoryName = (category: ProductCategory) => {
    if (!category) {
      return 'Unassigned';
    }

    if (typeof category !== 'string') {
      return category.name || 'Unassigned';
    }

    return types.find((type) => type._id === category)?.name || 'Unassigned';
  };

  const fetchTypes = async () => {
    try {
      setTypesLoading(true);
      const res = await getTypes();
      setTypes(res?.data || []);
    } catch {
      message.error('Unable to load product types');
    } finally {
      setTypesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await getProducts({ limit: 1000 });
      setProducts(res?.data?.products || []);
    } catch {
      message.error('Unable to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const refreshPage = async () => {
    await Promise.all([fetchTypes(), fetchProducts()]);
  };

  useEffect(() => {
    refreshPage();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return products.filter((product) => {
      const categoryName = getCategoryName(product.category).toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch) ||
        categoryName.includes(normalizedSearch);

      const matchesCategory =
        !categoryFilter || getCategoryId(product.category) === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, products, searchText, types]);

  const uncategorizedCount = products.filter(
    (product) => !getCategoryId(product.category)
  ).length;

  const openTypeModal = (type?: ProductType) => {
    setEditingType(type || null);
    setTypeModal(true);

    if (type) {
      typeForm.setFieldsValue({ name: type.name });
    } else {
      typeForm.resetFields();
    }
  };

  const closeTypeModal = () => {
    setTypeModal(false);
    setEditingType(null);
    typeForm.resetFields();
  };

  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

  const openProductModal = (product?: Product) => {
    setEditingProduct(product || null);
    setProductModal(true);
    setImageFileList([]);

    if (product) {
      productForm.setFieldsValue({
        name: product.name,
        description: product.description || '',
        category: getCategoryId(product.category),
        unit: product.unit || 'gm',
        prices: product.prices?.length
          ? product.prices
          : [{ size: undefined, price: undefined }],
        isActive: product.isActive ?? true,
      });
    } else {
      productForm.resetFields();
      productForm.setFieldsValue({
        isActive: true,
        unit: 'gm',
        prices: [{ size: undefined, price: undefined }],
      });
    }
  };

  const closeProductModal = () => {
    setProductModal(false);
    setEditingProduct(null);
    productForm.resetFields();
  };

  const handleSaveType = async () => {
    try {
      const values = await typeForm.validateFields();
      setSavingType(true);

      if (editingType) {
        await updateTypes(values, editingType._id);
        message.success('Type updated');
      } else {
        await createTypes(values);
        message.success('Type created');
      }

      closeTypeModal();
      await fetchTypes();
    } catch (error) {
      if (!(error as { errorFields?: unknown }).errorFields) {
        message.error('Unable to save type');
      }
    } finally {
      setSavingType(false);
    }
  };

  const handleDeleteType = async (type: ProductType) => {
    try {
      setDeletingId(type._id);
      await deleteTypes(type._id);
      message.success('Type deleted');
      await refreshPage();
    } catch {
      message.error('Unable to delete type');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const values = await productForm.validateFields();
      setSavingProduct(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('unit', values.unit);
      formData.append('prices', JSON.stringify(values.prices));
      formData.append('isActive', String(values.isActive ?? true));

      if (imageFileList[0]?.originFileObj) {
        formData.append('image', imageFileList[0].originFileObj);
      }

      if (editingProduct) {
        await updateProducts(formData, editingProduct._id);
        message.success('Product updated');
      } else {
        await createProducts(formData);
        message.success('Product created');
      }

      closeProductModal();
      await fetchProducts();
    } catch (error) {
      if (!(error as { errorFields?: unknown }).errorFields) {
        message.error('Unable to save product');
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      setDeletingId(product._id);
      await deleteProducts(product._id);
      message.success('Product deleted');
      await fetchProducts();
    } catch {
      message.error('Unable to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const typeColumns: ColumnsType<ProductType> = [
    {
      title: 'Type',
      dataIndex: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Products',
      width: 120,
      render: (_, record) =>
        products.filter(
          (product) => getCategoryId(product.category) === record._id
        ).length,
    },
    {
      title: 'Actions',
      width: 130,
      align: 'right',
      render: (_, record) => (
        <>
          <Space>
            <Tooltip title="Edit type">
              {canUpdate('products') && (
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => openTypeModal(record)}
                />
              )}
            </Tooltip>
            <Popconfirm
              title="Delete type?"
              description={`Delete "${record.name}" from product types?`}
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteType(record)}
            >
              <Tooltip title="Delete type">
                {canDelete('products') && (
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    loading={deletingId === record._id}
                  />
                )}
              </Tooltip>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  const productColumns: ColumnsType<Product> = [
    {
      title: 'Product',
      dataIndex: 'name',
      render: (name: string, record) => (
        <Space>
          {record.image ? (
            <Image
              src={`${BASEURL}/${record.image}`}
              width={32}
              height={32}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyBYlFiXAHMN6YQAAAAA"
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              📦
            </div>
          )}
          <Text strong style={{ maxWidth: 140 }} ellipsis={{ tooltip: name }}>
            {name}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      width: 100,
      render: (_, record) => {
        const hasCategory = Boolean(getCategoryId(record.category));
        return (
          <Tag color={hasCategory ? 'blue' : 'default'}>
            {getCategoryName(record.category)}
          </Tag>
        );
      },
    },
    {
      title: 'Size / Price',
      width: 130,
      render: (_, record) => {
        if (!record.prices?.length) return <Text type="secondary">—</Text>;
        return <SizePriceSelect prices={record.prices} unit={record.unit} />;
      },
    },
    {
      title: 'Status',
      width: 75,
      render: (_, record) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      width: 80,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit product">
            {canUpdate('products') && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => openProductModal(record)}
              />
            )}
          </Tooltip>
          <Popconfirm
            title="Delete product?"
            description={`Delete "${record.name}" from the catalog?`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteProduct(record)}
          >
            <Tooltip title="Delete product">
              {canDelete('products') && (
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  loading={deletingId === record._id}
                />
              )}
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* {JSON.stringify(canCreate('products'))} <br />
      {JSON.stringify(canUpdate('products'))} <br />
      {JSON.stringify(canDelete('products'))} */}
      <Space
        direction="vertical"
        size={20}
        style={{ display: 'flex', width: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Product Catalog
            </Title>
            <Text type="secondary">
              Manage snack products and the types used to organize them.
            </Text>
          </div>

          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={refreshPage}>
              Refresh
            </Button>
            <>
              {canCreate('products') && (
                <>
                  <Button
                    icon={<TagsOutlined />}
                    onClick={() => openTypeModal()}
                  >
                    Add Type
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openProductModal()}
                  >
                    Add Product
                  </Button>
                </>
              )}
            </>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Products"
                value={products.length}
                prefix={<AppstoreAddOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Types"
                value={types.length}
                prefix={<TagsOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Unassigned Products"
                value={uncategorizedCount}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={9}>
            <Card
              title="Product Types"
              extra={
                <>
                  {canCreate('products') && (
                    <Button
                      type="primary"
                      ghost
                      icon={<PlusOutlined />}
                      onClick={() => openTypeModal()}
                    >
                      New Type
                    </Button>
                  )}
                </>
              }
            >
              <Table
                columns={typeColumns}
                dataSource={types}
                rowHoverable={false}
                rowKey="_id"
                loading={typesLoading}
                pagination={false}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No types added"
                    />
                  ),
                }}
              />
            </Card>
          </Col>

          <Col xs={24} xl={15}>
            <Card
              title="Products"
              extra={
                <Space wrap>
                  <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    style={{ width: 160 }}
                  />
                  <Select
                    allowClear
                    placeholder="All types"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    style={{ width: 130 }}
                    options={types.map((type) => ({
                      label: type.name,
                      value: type._id,
                    }))}
                  />
                </Space>
              }
            >
              <Table
                columns={productColumns}
                dataSource={filteredProducts}
                rowHoverable={false}
                rowKey="_id"
                loading={productsLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 600 }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No products found"
                    />
                  ),
                }}
              />
            </Card>
          </Col>
        </Row>
      </Space>
      <Modal
        title={editingType ? 'Edit Type' : 'Create Type'}
        open={typeModal}
        onOk={handleSaveType}
        onCancel={closeTypeModal}
        confirmLoading={savingType}
        okText={editingType ? 'Update Type' : 'Create Type'}
        destroyOnHidden
      >
        <Form
          form={typeForm}
          layout="vertical"
          requiredMark={(label, { required }) =>
            required ? (
              <>
                {label} <span style={{ color: '#ff4d4f' }}>*</span>
              </>
            ) : (
              <span>
                {label}&nbsp;
                <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                  (Optional)
                </span>
              </span>
            )
          }
        >
          <Form.Item
            name="name"
            label="Type Name"
            rules={[{ required: true, message: 'Type name is required' }]}
          >
            <Input placeholder="e.g. Chips, Namkeen, Cookies" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        open={productModal}
        onOk={handleSaveProduct}
        onCancel={closeProductModal}
        confirmLoading={savingProduct}
        okText={editingProduct ? 'Update Product' : 'Create Product'}
        width={680}
        destroyOnHidden
      >
        <Form
          form={productForm}
          layout="vertical"
          requiredMark={(label, { required }) =>
            required ? (
              <>
                {label} <span style={{ color: '#ff4d4f' }}>*</span>
              </>
            ) : (
              <span>
                {label}&nbsp;
                <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                  (Optional)
                </span>
              </span>
            )
          }
        >
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: 'Product name is required' },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Type"
                rules={[{ required: true, message: 'Select a product type' }]}
              >
                <Select
                  showSearch
                  placeholder="Select type"
                  optionFilterProp="label"
                  options={types.map((type) => ({
                    label: type.name,
                    value: type._id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="unit"
                label="Unit"
                rules={[{ required: true, message: 'Unit is required' }]}
              >
                <Select
                  placeholder="Select unit"
                  options={['gm', 'kg', 'ml', 'ltr'].map((u) => ({
                    label: u,
                    value: u,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.List
            name="prices"
            rules={[
              {
                validator: async (_, v) => {
                  if (!v?.length)
                    return Promise.reject('Add at least one size & price');
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Text strong style={{ fontSize: 13 }}>
                    Size & Price
                  </Text>
                  <Button
                    size="small"
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add({ size: undefined, price: undefined })}
                  >
                    Add Size
                  </Button>
                </div>
                {fields.map(({ key, name }) => (
                  <Row
                    key={key}
                    gutter={8}
                    align="middle"
                    style={{ marginBottom: 8 }}
                  >
                    <Col span={6}>
                      <Form.Item
                        name={[name, 'size']}
                        label="Size"
                        rules={[{ required: true, message: 'Size required' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <SizeInput />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={[name, 'price']}
                        label="Price (₹)"
                        rules={[
                          { required: true, message: 'Price required' },
                          {
                            type: 'number',
                            min: 1,
                            message: 'Min price is 1',
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber
                          min={0}
                          placeholder="Price (₹)"
                          prefix="₹"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name={[name, 'pieces']}
                        label="Pieces/Katta"
                        rules={[{ required: true, message: 'Enter pieces' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber
                          min={1}
                          placeholder="No. of pieces"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter a short product description"
            />
          </Form.Item>

          <Row gutter={12} align="middle">
            <Col xs={24} md={16}>
              <Form.Item label="Product Image" style={{ marginBottom: 0 }}>
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={imageFileList}
                  onChange={({ fileList }) => setImageFileList(fileList)}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
                {editingProduct?.image && imageFileList.length === 0 && (
                  <Image
                    src={`${BASEURL}/${editingProduct.image}`}
                    width={60}
                    height={60}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 6,
                      marginTop: 8,
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="isActive"
                label="Active"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
