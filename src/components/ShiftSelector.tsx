import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import useShift from 'src/services/useShift';

interface Shift {
  value: string;
  label: string;
}

const ShiftSelector = () => {
  const { getShifts } = useShift();
  const [data, setData] = useState<Shift[]>([
    {
      value: '',
      label: '',
    },
  ]);

  useEffect(() => {
    getShifts()
      .then((res: any) => {
        const shift = res.data;

        if (shift.length) {
          setData(
            shift.map((s: any) => ({
              value: s._id,
              label: s.name,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Form.Item
        name="shiftId"
        label="Shift"
        rules={[{ required: true, message: 'Role is required' }]}
      >
        <Select
          placeholder="Select Shift"
          options={data.map((r) => ({ value: r.value, label: r.label }))}
        />
      </Form.Item>
    </div>
  );
};

export default ShiftSelector;
