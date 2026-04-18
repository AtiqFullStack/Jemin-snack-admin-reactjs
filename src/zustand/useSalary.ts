import apiClient from 'src/services/api/apiClient';
import { API_ENDPOINTS } from '../services/api/endpoints';
import { create } from 'zustand';

type SalaryRecord = {
  _id: string;
  staffId: string;
  effectiveFrom?: string;
  advanceDeduction?: number;
  salaryType?: string;
  isActive?: boolean;
  grossSalary?: number;
  totalDeductions?: number;
  netSalary?: number;
  earnings?: {
    basic?: number;
    hra?: number;
    allowance?: number;
    bonus?: number;
  };
  deductions?: {
    pf?: number;
    other?: number;
  };
};

type SalaryResponse = {
  activeSalary?: SalaryRecord | null;
  history?: SalaryRecord[];
};

type SalaryState = {
  employeSalary: any[];
  employe: SalaryResponse | null;
  getEmployeDetailsWithSalary: () => Promise<void>;
  getSalaryWithStaffId: (id: string) => Promise<void>;
  createSalary: (payload: {
    staffId: string;
    effectiveFrom: string;
    salaryType: 'monthly' | 'daily';
    earnings: {
      basic: number;
      hra: number;
      allowance: number;
      bonus: number;
    };
    deductions: {
      pf: number | { type: string; value: number };
      other: number;
    };
    advanceDeduction: number;
  }) => Promise<any>;
  updateSalary: (
    staffId: string,
    payload: {
      staffId: string;
      effectiveFrom: string;
      salaryType: 'monthly' | 'daily';
      earnings: {
        basic: number;
        hra: number;
        allowance: number;
        bonus: number;
      };
      deductions: {
        pf: number | { type: string; value: number };
        other: number;
      };
      advanceDeduction: number;
    }
  ) => Promise<any>;
};

const useSalary = create<SalaryState>((set) => ({
  employeSalary: [],
  employe: null,
  getEmployeDetailsWithSalary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SALARY.LIST);
    console.log(response);
    set({ employeSalary: response.data.data });
  },
  getSalaryWithStaffId: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.SALARY.GET(id));
    console.log(response);
    set({ employe: response.data.data });
  },
  createSalary: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.SALARY.CREATE, payload);
    return response.data;
  },
  updateSalary: async (staffId, payload: any) => {
    const response = await apiClient.put(
      API_ENDPOINTS.SALARY.UPDATE(staffId),
      payload
    );
    return response.data;
  },
}));

export default useSalary;
