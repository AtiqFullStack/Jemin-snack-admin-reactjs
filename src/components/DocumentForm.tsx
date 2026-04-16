import {
  InfoCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Typography,
  Button,
  Space,
} from 'antd';
import React, { useEffect } from 'react';

const { Text } = Typography;

const DocumentForm = (props: any) => {
  const { DOC_FIELDS, form, editDoc } = props;

  // 🔥 Watch probationPeriod
  const probation = Form.useWatch('probationPeriod', form);

  // 🔥 Auto generate salesTargets based on probation
  useEffect(() => {
    if (!probation) return;

    const existing = form.getFieldValue('salesTargets') || [];

    // Agar already same length hai to skip
    if (existing.length === probation) return;

    const generated = Array.from({ length: probation }).map((_, i) => ({
      label: `Month ${i + 1}`,
      value: '',
    }));

    form.setFieldsValue({ salesTargets: generated });
  }, [probation]);

  return (
    <div style={{ padding: '8px 32px' }}>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {(DOC_FIELDS[editDoc?.title] || []).map((field: any) => {
            const isSalesTarget = field.key === 'salesTargets';
            const isAllowance = field.key === 'allowances';
            const isDocs = field.key === 'requiredDocuments';
            // console.log({isAllowance ,isSalesTarget,isDocs})

            return (
              <Col
                span={
                  field.type === 'number' ||
                  DOC_FIELDS[editDoc?.title].length > 4
                    ? 12
                    : 24
                }
                key={field.key}
              >
                <Form.Item
                  label={
                    <Text style={{ fontSize: 13, fontWeight: 600 }}>
                      {field.label}
                    </Text>
                  }
                >
                  {/* 🔥 SALES TARGETS */}
                  {isSalesTarget ? (
                    <Form.List name="salesTargets">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name }) => (
                            <Space
                              key={key}
                              style={{ display: 'flex', marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                name={[name, 'label']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Month / Label" />
                              </Form.Item>

                              <Form.Item
                                name={[name, 'value']}
                                rules={[{ required: true }]}
                              >
                                <InputNumber placeholder="Target" />
                              </Form.Item>

                              <DeleteOutlined
                                onClick={() => remove(name)}
                                style={{ color: 'red' }}
                              />
                            </Space>
                          ))}

                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()}
                            block
                          >
                            Add Target
                          </Button>
                        </>
                      )}
                    </Form.List>
                  ) : isAllowance ? (
                    /* 🔥 ALLOWANCES */
                    <Form.List name="allowances">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name }) => (
                            <Space
                              key={key}
                              style={{ display: 'flex', marginBottom: 8 }}
                            >
                              <Form.Item
                                name={[name, 'label']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Allowance Name" />
                              </Form.Item>

                              <Form.Item
                                name={[name, 'value']}
                                rules={[{ required: true }]}
                              >
                                <InputNumber placeholder="value" />
                              </Form.Item>

                              <DeleteOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}

                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Allowance
                          </Button>
                        </>
                      )}
                    </Form.List>
                  ) : isDocs ? (
                    /* 🔥 REQUIRED DOCS */
                    <Form.List name="requiredDocuments">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name }) => (
                            <Space
                              key={key}
                              style={{ display: 'flex', marginBottom: 8 }}
                            >
                              <Form.Item
                                name={name}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Document Name" />
                              </Form.Item>

                              <DeleteOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}

                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Document
                          </Button>
                        </>
                      )}
                    </Form.List>
                  ) : field.type === 'number' ? (
                    <Form.Item name={field.key} noStyle>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  ) : field.type === 'date' ? (
                    <Form.Item name={field.key} noStyle>
                      <Input type="date" />
                    </Form.Item>
                  ) : (
                    <Form.Item name={field.key} noStyle>
                      <Input />
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>

        {/* Info Box */}
        <div
          style={{
            background: '#fff7e6',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
            marginBottom: 8,
          }}
        >
          <InfoCircleOutlined style={{ color: '#d46b08' }} />
          <Text style={{ fontSize: 12 }}>
            Updating these fields will log activity. Preview updates instantly.
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default DocumentForm;
