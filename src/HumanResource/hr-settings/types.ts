import type { TabsProps } from 'antd';

export type HrShift = {
  name: string;
  startTime: string;
  endTime: string;
  breakTimeMinutes: number;
};

export type HrHoliday = {
  name: string;
  date: string;
};

export type HrMonthlyOffPattern = {
  week: 'first' | 'second' | 'third' | 'fourth' | 'last';
  day: string;
};

export type HrSalaryRules = {
  workingDaysPerMonth: number;
  dailyWorkingHours: number;
  overtimeRatePerHour: number;
  latePenaltyPerMinute: number;
};

export type HrLeavePolicy = {
  casualLeaves: number;
  sickLeaves: number;
  paidLeaves: number;
};

export type HrSettingsForm = {
  companyName: string;
  shifts: HrShift[];
  weeklyOffPolicy: {
    fixedDays: string[];
    monthlyPatterns: HrMonthlyOffPattern[];
  };
  holidays: HrHoliday[];
  salaryRules: HrSalaryRules;
  leavePolicy: HrLeavePolicy;
};

export type HrSettingsContextValue = {
  form: HrSettingsForm;
  setCompanyName: (value: string) => void;
  addShift: () => void;
  updateShift: (
    index: number,
    key: keyof HrShift,
    value: string | number
  ) => void;
  removeShift: (index: number) => void;
  toggleWeeklyOff: (day: string) => void;
  addMonthlyOffPattern: () => void;
  updateMonthlyOffPattern: (
    index: number,
    key: keyof HrMonthlyOffPattern,
    value: string
  ) => void;
  removeMonthlyOffPattern: (index: number) => void;
  addHoliday: () => void;
  updateHoliday: (index: number, key: keyof HrHoliday, value: string) => void;
  removeHoliday: (index: number) => void;
  updateSalary: (key: keyof HrSalaryRules, value: number) => void;
  updateLeave: (key: keyof HrLeavePolicy, value: number) => void;
  handleSave: () => void;
};

export const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const MONTHLY_OFF_WEEKS: HrMonthlyOffPattern['week'][] = [
  'first',
  'second',
  'third',
  'fourth',
  'last',
];

export const HR_SETTINGS_TABS: TabsProps['items'] = [
  { key: 'company', label: 'Company' },
  { key: 'shifts', label: 'Shifts' },
  { key: 'weekly-offs', label: 'Weekly Offs' },
  { key: 'holidays', label: 'Holidays' },
  { key: 'salary-rules', label: 'Salary Rules' },
  { key: 'leave-policy', label: 'Leave Policy' },
];

export const DEFAULT_HR_SETTINGS_FORM: HrSettingsForm = {
  companyName: 'Jemini Snacks',
  shifts: [
    {
      name: 'Morning',
      startTime: '09:00',
      endTime: '18:00',
      breakTimeMinutes: 60,
    },
  ],
  weeklyOffPolicy: {
    fixedDays: ['Sunday'],
    monthlyPatterns: [
      { week: 'second', day: 'Saturday' },
      { week: 'fourth', day: 'Saturday' },
    ],
  },
  holidays: [{ name: 'Republic Day', date: '2026-01-26' }],
  salaryRules: {
    workingDaysPerMonth: 26,
    dailyWorkingHours: 8,
    overtimeRatePerHour: 100,
    latePenaltyPerMinute: 2,
  },
  leavePolicy: {
    casualLeaves: 12,
    sickLeaves: 6,
    paidLeaves: 12,
  },
};
