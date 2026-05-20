import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TagsOutlined,
} from '@ant-design/icons';
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
  availableSize?: number[];
};

type ProductFormValues = {
  name: string;
  description: string;
  image: string;
  category: string;
  availableSize: number[];
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
      const res = await getProducts();
      setProducts(res?.data?.products || res?.data || []);
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

  const openProductModal = (product?: Product) => {
    setEditingProduct(product || null);
    setProductModal(true);

    const DEFAULT_SIZES = [16, 18, 22, 34, 32, 34, 36, 38];
    if (product) {
      productForm.setFieldsValue({
        name: product.name,
        description: product.description || '',
        image: product.image || product.imageUrl || '',
        category: getCategoryId(product.category),
        availableSize: product.availableSize ?? DEFAULT_SIZES,
      });
    } else {
      productForm.resetFields();
      productForm.setFieldsValue({ availableSize: DEFAULT_SIZES });
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

      if (editingProduct) {
        await updateProducts(values, editingProduct._id);
        message.success('Product updated');
      } else {
        await createProducts(values);
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
          <Space direction="vertical" size={0}>
            <Text strong>{name}</Text>
            <Text ellipsis type="secondary" style={{ maxWidth: 200 }}>
              {record.description || 'No description'}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Category',
      width: 180,
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
      title: 'Actions',
      width: 130,
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
                    placeholder="Search products"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    style={{ width: 240 }}
                  />
                  <Select
                    allowClear
                    placeholder="All types"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    style={{ width: 180 }}
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
                pagination={{ pageSize: 8, showSizeChanger: true }}
                // scroll={{ x: 720 }}
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
        <Form form={typeForm} layout="vertical">
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
        <Form form={productForm} layout="vertical">
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

          {/* <Form.Item
                        name="image"
                        label="Image URL"
                        rules={[
                            { required: false, message: 'Image URL is required' },
                            { type: 'url', message: 'Enter a valid URL' },
                        ]}
                    >
                        <Input placeholder="https://example.com/product.png" />
                    </Form.Item> */}

          <Form.Item
            name="availableSize"
            label="Available Sizes"
            rules={[
              { required: true, message: 'At least one size is required' },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Select or add sizes"
              tokenSeparators={[',']}
              options={[16, 18, 22, 32, 34, 36, 38].map((s) => ({
                label: s,
                value: s,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter a short product description"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
