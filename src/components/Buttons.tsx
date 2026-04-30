import { EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

const Buttons = () => {
  const openEditDrawer = (record: any) => {
    console.log('Edit record:', record);
  };
  const handleDelete = (record: any) => {
    console.log('Delete record:', record);
  };
  const record = {};
  return (
    <Space>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={() => openEditDrawer(record)}
      >
        Edit
      </Button>
      <Button danger type="text" onClick={() => handleDelete(record)}>
        Delete
      </Button>
    </Space>
  );
};

export default Buttons;
