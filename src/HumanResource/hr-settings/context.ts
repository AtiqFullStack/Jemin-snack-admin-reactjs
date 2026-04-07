import { createContext, useContext } from 'react';
import type { HrSettingsContextValue } from './types';

export const HrSettingsContext = createContext<HrSettingsContextValue | null>(
  null
);

export const useHrSettingsContext = () => {
  const context = useContext(HrSettingsContext);

  if (!context) {
    throw new Error('useHrSettingsContext must be used within HrSettings');
  }

  return context;
};
