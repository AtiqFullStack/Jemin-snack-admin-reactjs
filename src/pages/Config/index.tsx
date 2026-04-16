import { useEffect, useState } from 'react';
import {
  Card,
  Tag,
  Row,
  Col,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import configService from 'src/services/configService';

const ConfigManager = () => {
  const { getConfig, createConfig, updateConfig, deleteConfig } =
    configService();

  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await getConfig();
      setConfigs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (config = null) => {
    setEditingConfig(config);
    setIsModalOpen(true);

    if (config) {
      form.setFieldsValue(config);
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      //   console.log(values)
      //   return

      if (editingConfig) {
        await updateConfig(editingConfig._id, values);
        message.success('Config updated successfully');
      } else {
        await createConfig(values);
        message.success('Config created successfully');
      }

      setIsModalOpen(false);
      fetchConfigs();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteConfig(id);
      message.success('Deleted successfully');
      fetchConfigs();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2>⚙️ Config Manager</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Config
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {configs.map((config) => (
          <Col xs={24} md={12} lg={8} key={config._id}>
            <Card
              title={config.key}
              hoverable
              style={{ borderRadius: 12 }}
              extra={
                <Space>
                  <EditOutlined onClick={() => openModal(config)} />
                  <DeleteOutlined onClick={() => handleDelete(config._id)} />
                </Space>
              }
            >
              <p style={{ color: '#888', marginBottom: 12 }}>
                {config.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {config.value
                  ?.sort((a, b) => a.order - b.order)
                  .map((item, i) => (
                    <Tag
                      key={i}
                      color={item.color}
                      style={{ padding: '4px 10px', borderRadius: 6 }}
                    >
                      {item.label}
                    </Tag>
                  ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingConfig ? '✏️ Edit Config' : '➕ Create Config'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        width={850}
      >
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="key"
                label="Config Key"
                rules={[{ required: true, message: 'Key is required' }]}
              >
                <Input placeholder="e.g. employeDesignation" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="description" label="Description">
                <Input placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Values</Divider>

          <Form.List name="value">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 10, borderRadius: 10 }}
                  >
                    <Row gutter={10} align="middle">
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'label']}
                          label="Label"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Display name" />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          label="Value (No Spaces)"
                          rules={[
                            { required: true },
                            {
                              pattern: /^\S+$/,
                              message: 'Spaces not allowed',
                            },
                          ]}
                        >
                          <Input placeholder="unique_key" />
                        </Form.Item>
                      </Col>

                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'color']}
                          label="Color"
                        >
                          <Input placeholder="#0d6efd" />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'order']}
                          label="Order"
                        >
                          <Input type="number" />
                        </Form.Item>
                      </Col>

                      <Col span={3}>
                        <Button
                          danger
                          style={{ marginTop: 30 }}
                          onClick={() => remove(name)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Value
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ConfigManager;
