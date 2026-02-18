import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Drawer,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  message,
  Divider,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getPermissionsGrouped } from '../../../config/permissions';
import './styles.css';
import roleService from '../../../services/roleService';

type Role = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  permissions: string[];
  users_count: number;
  created_at: string;
};

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // get ROles and Permissions from config
  const { getRoles, createRoles, deleteRoles, updateRoles } = roleService();

  const permissionsGrouped = getPermissionsGrouped();
  const allPermissionKeys = Object.values(permissionsGrouped).flatMap((g) =>
    g.items.map((i) => i.key)
  );

  useEffect(() => {
    getRoles()
      .then((fetchedRoles: any) => {
        if (fetchedRoles.success) {
          setRoles(fetchedRoles.data); // Assuming the API response has a 'data' object with 'roles' array
        }
        console.log(fetchedRoles);
        // Assuming fetchedRoles is an array of roles in the correct format
        // setRoles(fetchedRoles);
      })
      .catch(() => {
        message.error('Failed to fetch roles');
      });
  }, []);

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
    });
    setSelectedPermissions(role.permissions || []);
    setIsDrawerOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    Modal.confirm({
      title: 'Delete Role',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Add your delete API call here
        console.log(`Delete role with ID: ${role._id}`);
        if (!role._id) {
          message.error('Role ID is missing');
          return;
        }
        deleteRoles(role._id).then((res: any) => {
          if (res.success) {
            setRoles(roles.filter((r) => r._id !== role._id));
            message.success(res.message || 'Role deleted successfully');
          } else {
            message.error(res.message || 'Failed to delete role');
          }
        });
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.slice(0, 3).map((p) => (
            <Tag key={p}>{p}</Tag>
          ))}
          {permissions.length > 3 && <Tag>+{permissions.length - 3} more</Tag>}
        </Space>
      ),
    },
    { title: 'Users', dataIndex: 'users_count', key: 'users_count' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Actions',
      key: 'actions',
      render: (role: any) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(role)}
          />
          <Button
            size="small"
            onClick={() => handleDeleteRole(role)}
            danger
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const handleSaveRole = async () => {
    form.validateFields().then(async (values) => {
      if (editingRole) {
        // Update existing role
        const updatedRole: Role = {
          ...editingRole,
          name: values.name,
          description: values.description,
          permissions: selectedPermissions,
        };
        const res = (await updateRoles(editingRole._id!, updatedRole)) as any;
        if (res.success) {
          setRoles(
            roles.map((r) => (r._id === editingRole._id ? updatedRole : r))
          );
          message.success(res.message || 'Role updated successfully');
        } else {
          message.error(res.message || 'Failed to update role');
        }
      } else {
        // Create new role
        const newRole: Role = {
          id: `R-${String(roles.length + 1).padStart(3, '0')}`,
          name: values.name,
          description: values.description,
          permissions: selectedPermissions,
          users_count: 0,
          created_at: new Date().toISOString().split('T')[0],
        };
        const res = (await createRoles(newRole)) as any;
        if (res.success) {
          setRoles([...roles, newRole]);
          message.success(res.message || 'Role created successfully');
        } else {
          message.error(res.message || 'Failed to create role');
        }
      }
      setIsDrawerOpen(false);
      form.resetFields();
      setSelectedPermissions([]);
      setEditingRole(null);
    });
  };

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionKey]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== permissionKey)
      );
    }
  };

  const handleSelectAll = () => {
    setSelectedPermissions(allPermissionKeys);
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleGroupSelectAll = (groupKey: string) => {
    const groupPermissions = permissionsGrouped[groupKey].items.map(
      (i) => i.key
    );
    const newSelected = [
      ...new Set([...selectedPermissions, ...groupPermissions]),
    ];
    setSelectedPermissions(newSelected);
  };

  const handleGroupDeselectAll = (groupKey: string) => {
    const groupPermissions = permissionsGrouped[groupKey].items.map(
      (i) => i.key
    );
    setSelectedPermissions(
      selectedPermissions.filter((p) => !groupPermissions.includes(p))
    );
  };

  return (
    <div className="roles-page">
      <Card
        title="Roles & Permissions"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Add Role
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={roles}
          pagination={{ pageSize: 10 }}
          rowHoverable={false}
        />
      </Card>

      <Drawer
        title={editingRole ? 'Edit Role' : 'Add New Role'}
        placement="right"
        width={800}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          form.resetFields();
          setSelectedPermissions([]);
          setEditingRole(null);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
                setEditingRole(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleSaveRole}>
              {editingRole ? 'Update Role' : 'Save Role'}
            </Button>
          </Space>
        }
      >
        <Row gutter={24} className="roles-drawer-content">
          <Col xs={24} lg={10} className="roles-form-section">
            <Form form={form} layout="vertical">
              <Form.Item
                name="name"
                label="Role Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter role name" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} placeholder="Enter role description" />
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} lg={14} className="roles-permissions-section">
            <div className="permissions-header">
              <div>
                <strong>Permissions</strong>
                <div style={{ color: '#666', fontSize: 12 }}>
                  Select permissions for this role
                </div>
              </div>
              <Space>
                <Button size="small" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button size="small" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
              </Space>
            </div>

            <div className="permissions-scroll">
              {Object.entries(permissionsGrouped).map(([groupKey, group]) => (
                <div key={groupKey} className="permission-group">
                  <Divider plain style={{ margin: '8px 0 12px' }}>
                    <Space>
                      <span>{group.groupLabel}</span>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => handleGroupSelectAll(groupKey)}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => handleGroupDeselectAll(groupKey)}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        None
                      </Button>
                    </Space>
                  </Divider>
                  <Row gutter={[8, 8]}>
                    {group.items.map((item) => (
                      <Col xs={24} sm={12} key={item.key}>
                        <Checkbox
                          checked={selectedPermissions.includes(item.key)}
                          onChange={(e) =>
                            handlePermissionChange(item.key, e.target.checked)
                          }
                        >
                          <span className="permission-checkbox">
                            {item.label}
                          </span>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Drawer>
    </div>
  );
};

export default RolesPage;
