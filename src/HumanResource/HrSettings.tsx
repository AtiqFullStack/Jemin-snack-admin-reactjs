import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Tabs, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DEFAULT_HR_SETTINGS_FORM,
  HR_SETTINGS_TABS,
  type HrHoliday,
  type HrLeavePolicy,
  type HrSalaryRules,
  type HrSettingsContextValue,
  type HrSettingsForm,
  type HrShift,
} from './hr-settings/types';

const { Title, Text } = Typography;

const HrSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<HrSettingsForm>(DEFAULT_HR_SETTINGS_FORM);

  const activeKey = useMemo(() => {
    return (
      HR_SETTINGS_TABS?.find((item) =>
        location.pathname.endsWith(`/${item?.key}`)
      )?.key || 'company'
    );
  }, [location.pathname]);

  const setCompanyName = (value: string) => {
    setForm((prev) => ({ ...prev, companyName: value }));
  };

  const addShift = () => {
    setForm((prev) => ({
      ...prev,
      shifts: [
        ...prev.shifts,
        { name: '', startTime: '', endTime: '', breakTimeMinutes: 60 },
      ],
    }));
  };

  const updateShift = (
    index: number,
    key: keyof HrShift,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      shifts: prev.shifts.map((shift, shiftIndex) =>
        shiftIndex === index ? { ...shift, [key]: value } : shift
      ),
    }));
  };

  const removeShift = (index: number) => {
    setForm((prev) => ({
      ...prev,
      shifts: prev.shifts.filter((_, shiftIndex) => shiftIndex !== index),
    }));
  };

  const toggleWeeklyOff = (day: string) => {
    setForm((prev) => ({
      ...prev,
      weeklyOffPolicy: {
        ...prev.weeklyOffPolicy,
        fixedDays: prev.weeklyOffPolicy.fixedDays.includes(day)
          ? prev.weeklyOffPolicy.fixedDays.filter((item) => item !== day)
          : [...prev.weeklyOffPolicy.fixedDays, day],
      },
    }));
  };

  const addMonthlyOffPattern = () => {
    setForm((prev) => ({
      ...prev,
      weeklyOffPolicy: {
        ...prev.weeklyOffPolicy,
        monthlyPatterns: [
          ...prev.weeklyOffPolicy.monthlyPatterns,
          { week: 'first', day: 'Saturday' },
        ],
      },
    }));
  };

  const updateMonthlyOffPattern = (
    index: number,
    key: 'week' | 'day',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      weeklyOffPolicy: {
        ...prev.weeklyOffPolicy,
        monthlyPatterns: prev.weeklyOffPolicy.monthlyPatterns.map(
          (pattern, patternIndex) =>
            patternIndex === index ? { ...pattern, [key]: value } : pattern
        ),
      },
    }));
  };

  const removeMonthlyOffPattern = (index: number) => {
    setForm((prev) => ({
      ...prev,
      weeklyOffPolicy: {
        ...prev.weeklyOffPolicy,
        monthlyPatterns: prev.weeklyOffPolicy.monthlyPatterns.filter(
          (_, patternIndex) => patternIndex !== index
        ),
      },
    }));
  };

  const addHoliday = () => {
    setForm((prev) => ({
      ...prev,
      holidays: [...prev.holidays, { name: '', date: '' }],
    }));
  };

  const updateHoliday = (
    index: number,
    key: keyof HrHoliday,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      holidays: prev.holidays.map((holiday, holidayIndex) =>
        holidayIndex === index ? { ...holiday, [key]: value } : holiday
      ),
    }));
  };

  const removeHoliday = (index: number) => {
    setForm((prev) => ({
      ...prev,
      holidays: prev.holidays.filter(
        (_, holidayIndex) => holidayIndex !== index
      ),
    }));
  };

  const updateSalary = (key: keyof HrSalaryRules, value: number) => {
    setForm((prev) => ({
      ...prev,
      salaryRules: { ...prev.salaryRules, [key]: value },
    }));
  };

  const updateLeave = (key: keyof HrLeavePolicy, value: number) => {
    setForm((prev) => ({
      ...prev,
      leavePolicy: { ...prev.leavePolicy, [key]: value },
    }));
  };

  const handleSave = () => {
    console.log('HRMS Settings:', form);
    message.success('Settings prepared successfully');
  };

  const contextValue: HrSettingsContextValue = {
    form,
    setCompanyName,
    addShift,
    updateShift,
    removeShift,
    toggleWeeklyOff,
    addMonthlyOffPattern,
    updateMonthlyOffPattern,
    removeMonthlyOffPattern,
    addHoliday,
    updateHoliday,
    removeHoliday,
    updateSalary,
    updateLeave,
    handleSave,
  };

  return (
    <Card bordered={false}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            HRMS Settings
          </Title>
          <Text type="secondary">
            Configure company rules, attendance policy and payroll defaults.
          </Text>
        </div>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Save Settings
        </Button>
      </Flex>

      <Tabs
        activeKey={String(activeKey)}
        items={HR_SETTINGS_TABS}
        onChange={(key) => navigate(`/hrms/setting/configuration/${key}`)}
        style={{ marginTop: 24 }}
      />

      <Outlet context={contextValue} />
    </Card>
  );
};

export default HrSettings;
